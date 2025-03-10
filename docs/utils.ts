// TypeScript interface and function
interface UserData {{
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
}}

export const getUserData = async (userId: number): Promise<UserData> => {{
    const response = await fetch(`/api/users/${{userId}}`);
    if (!response.ok) {{
        throw new Error('Failed to fetch user data');
    }}
    return response.json();
}};
