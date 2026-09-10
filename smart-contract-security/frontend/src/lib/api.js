const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function analyzeContract(source) {
    if (!source || source.trim() === "") {
        throw new Error("Source code cannot be empty");
    }

    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ source })
    });

    if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}
