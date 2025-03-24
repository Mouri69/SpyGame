// JavaScript module
export const processnPfs = async (params) => {{
    try {{
        const response = await fetch('/api/data/UotMO3', {{
            method: 'POST',
            headers: {{
                'Content-Type': 'application/json'
            }},
            body: JSON.stringify(params)
        }});
        return await response.json();
    }} catch (error) {{
        console.error('Error:', error);
        throw error;
    }}
}};
