from github import Github
import re
import math

def normalized_activity_score(raw_score):
    # Avoid log(0) errors
    return min((math.log(raw_score + 1) / math.log(1_000_000 + 1)) * 100, 100)


print("Starting scoring script...")

g = Github('Personal Access Token')

MAX_COMMITS_PER_REPO = 30

def extract_keywords(text):
    """Simple keyword extraction from repo description fallback."""
    if not text:
        return []
    words = re.findall(r'\b\w+\b', text.lower())
    stopwords = set(['the', 'and', 'of', 'a', 'in', 'to', 'for', 'with', 'on', 'by', 'an'])
    keywords = [w for w in words if w not in stopwords and len(w) > 2]
    return keywords

def get_user_score(username):
    user = g.get_user(username)
    total_commits = 0
    total_prs = 0
    total_loc = 0
    total_repo_stars = 0
    repo_topics = set()
    followers = user.followers

    for repo in user.get_repos():
        try:
            commits = repo.get_commits(author=user)

            # Total commits count
            total_commits += commits.totalCount

            # LOC: Sum additions for latest N commits only for performance
            loc = 0
            count = 0
            for commit in commits:
                if count >= MAX_COMMITS_PER_REPO:
                    break
                try:
                    if commit.stats:
                        loc += commit.stats.additions
                except:
                    pass
                count += 1
            total_loc += loc

            # Stars
            total_repo_stars += repo.stargazers_count

            # Topics with fallback to description keywords
            topics = repo.get_topics()
            if not topics:
                topics = extract_keywords(repo.description)
            repo_topics.update(topics)

            # Pull requests count
            pulls = repo.get_pulls(state='all')
            repo_pr_count = sum(1 for pr in pulls if pr.user and pr.user.login == username)
            total_prs += repo_pr_count

        except Exception:
            # ignore repos with errors to continue fast
            pass

    # Weighted scoring
    score = (
        total_commits * 0.4 +
        total_prs * 0.3 +
        total_loc * 0.2 +
        followers * 0.05 +
        total_repo_stars * 0.05
    )

    return {
        'score': score,
        'total_commits': total_commits,
        'total_prs': total_prs,
        'total_loc': total_loc,
        'followers': followers,
        'total_repo_stars': total_repo_stars,
        'repo_topics': list(repo_topics)
    }

def relevance_score(topics_user, topics_target):
    set_user = set(t.lower() for t in topics_user)
    set_target = set(t.lower() for t in topics_target)

    if not set_user or not set_target:
        return 0.0

    intersection = set_user.intersection(set_target)
    union = set_user.union(set_target)
    return len(intersection) / len(union)

def combined_matching_score(username, project_topics, admin_topics,
                            weights=None, max_raw_score=500000):
    if weights is None:
        weights = {
            'activity': 0.6,
            'project_relevance': 0.2,
            'admin_compatibility': 0.2
        }
    user_scores = get_user_score(username)
    normalized_activity = normalized_activity_score(user_scores['score'])
    proj_rel = relevance_score(user_scores['repo_topics'], project_topics)
    admin_comp = relevance_score(user_scores['repo_topics'], admin_topics)
    final_score = (
        weights['activity'] * normalized_activity +
        weights['project_relevance'] * proj_rel * 100 +
        weights['admin_compatibility'] * admin_comp * 100
    )
    final_score = min(final_score, 100)
    return {
        'username': username,
        'activity_score_percent': normalized_activity,
        'project_relevance_percent': proj_rel * 100,
        'admin_compatibility_percent': admin_comp * 100,
        'final_score_percent': final_score
    }

if _name_ == "_main_":
    username = input("Enter GitHub username: ")
    project_topics = ["machine-learning", "nlp", "Python", "deep-learning", "JavaScript"]
    admin_topics = ["Python", "django", "api", "web"]

    scores = combined_matching_score(username, project_topics, admin_topics)

    print(f"\nScores summary for {username}:")
    print(f"  Project Relevance Score: {scores['project_relevance_percent']:.2f}%")
    print(f"  Admin Compatibility Score: {scores['admin_compatibility_percent']:.2f}%")
    print(f"  Combined Final Score: {scores['final_score_percent']:.2f}%")