const projectId = "udomg807";
const dataset = "production";
const apiVersion = "2025-06-06";

export async function fetchSanityData(
  query: string,
  params: Record<string, any> = {},
) {
  const encodeQuery = encodeURIComponent(query);
  const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeQuery}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Sanity data: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}
