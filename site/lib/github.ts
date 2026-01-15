export async function fetchGitHubContent(path: string) {
    const res = await fetch(`https://raw.githubusercontent.com/nishanth-kj/Pin-Board/refs/heads/main/${path}`);
    if (!res.ok) throw new Error('Failed to fetch content');
    return res.text();
}

export async function fetchLatestRelease() {
    const res = await fetch('https://api.github.com/repos/nishanth-kj/Pin-Board/releases/latest');
    if (!res.ok) throw new Error('Failed to fetch release');
    return res.json();
}
