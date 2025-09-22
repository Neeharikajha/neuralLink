from github import Github

g = Github("Personal Access Token")

def get_top_languages(username):
    user = g.get_user(username)
    lang_count = {}

    for repo in user.get_repos():
        try:
            language = repo.language
            if language:
                lang_count[language] = lang_count.get(language, 0) + 1
        except:
            pass

    sorted_langs = sorted(lang_count.items(), key=lambda x: x[1], reverse=True)
    return [lang for lang, count in sorted_langs[:3]]  # top 3 languages

if _name_ == "_main_":
    username = input("Enter GitHub username: ")
    langs = get_top_languages(username)
    print(f"Top languages used by {username}: {langs}")