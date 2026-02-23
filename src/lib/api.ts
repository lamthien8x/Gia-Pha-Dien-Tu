/**
 * API Client - Gọi backend API thay vì query Supabase trực tiếp
 * Tất cả request đi qua Next.js API Routes (server-side)
 */

const API_BASE = '/api';

interface ApiResponse<T> {
    data?: T;
    error?: string;
    meta?: Record<string, any>;
}

async function fetchApi<T>(
    endpoint: string,
    options?: RequestInit
): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });

        const json = await response.json();

        if (!response.ok) {
            return { error: json.error || 'Request failed' };
        }

        // Return json.data mapped to data, along with meta if it exists
        return {
            data: json.data !== undefined ? json.data : json,
            meta: json.meta
        };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { error: message };
    }
}

// ==================== MEDIA API ====================

export const mediaApi = {
    // Lấy danh sách media
    list: async (state?: string) => {
        const query = state ? `?state=${state}` : '';
        return fetchApi<any[]>(`/media${query}`);
    },

    // Lấy danh sách media theo người được gắn thẻ
    listByPerson: async (personHandle: string) => {
        return fetchApi<any[]>(`/media?person=${personHandle}&state=PUBLISHED`); // Only show PUBLISHED media on person profile
    },

    // Lấy danh sách media theo sự kiện được gắn thẻ
    listByEvent: async (eventId: string) => {
        return fetchApi<any[]>(`/media?event=${eventId}&state=PUBLISHED`); // Only show PUBLISHED media on event profile
    },

    // Upload file (multipart/form-data)
    upload: async (file: File, userId: string, title?: string, taggedPeople?: string[], taggedEvents?: string[]) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', userId);
        if (title) formData.append('title', title);
        if (taggedPeople && taggedPeople.length > 0) formData.append('taggedPeople', JSON.stringify(taggedPeople));
        if (taggedEvents && taggedEvents.length > 0) formData.append('taggedEvents', JSON.stringify(taggedEvents));

        try {
            const response = await fetch(`${API_BASE}/media/upload`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                return { error: data.error || 'Upload failed' };
            }

            return { data: data.data };
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            return { error: message };
        }
    },

    // Approve/Reject media
    updateState: async (id: string, action: 'approve' | 'reject') => {
        return fetchApi(`/media/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ action }),
        });
    },

    // Update tags for media
    updateTags: async (id: string, taggedPeople: string[], taggedEvents: string[]) => {
        return fetchApi(`/media/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ action: 'update_tags', tagged_people: taggedPeople, tagged_events: taggedEvents }),
        });
    },

    // Delete media
    delete: async (id: string) => {
        return fetchApi(`/media/${id}`, {
            method: 'DELETE',
        });
    },
};

// ==================== POSTS API ====================

export const postsApi = {
    // Lấy danh sách posts
    list: async ({ status = 'published', limit = 20, offset = 0 } = {}) => {
        return fetchApi<any[]>(`/posts?status=${status}&limit=${limit}&offset=${offset}`);
    },

    // Tạo post mới
    create: async (postData: {
        author_id: string;
        type?: string;
        title?: string;
        body: string;
        is_pinned?: boolean;
    }) => {
        return fetchApi('/posts', {
            method: 'POST',
            body: JSON.stringify(postData),
        });
    },

    // Lấy comments của post
    getComments: async (postId: string) => {
        return fetchApi<any[]>(`/posts/${postId}/comments`);
    },

    // Thêm comment
    addComment: async (postId: string, authorId: string, content: string) => {
        return fetchApi(`/posts/${postId}/comments`, {
            method: 'POST',
            body: JSON.stringify({ author_id: authorId, body: content }),
        });
    },

    // Toggle pin post
    togglePin: async (postId: string, isPinned: boolean) => {
        return fetchApi(`/posts/${postId}`, {
            method: 'PATCH',
            body: JSON.stringify({ is_pinned: isPinned }),
        });
    },

    // Delete post
    delete: async (postId: string) => {
        return fetchApi(`/posts/${postId}`, {
            method: 'DELETE',
        });
    },
};

// ==================== PEOPLE API ====================

export const peopleApi = {
    // Lấy danh sách people
    list: async (filters?: {
        generation?: number;
        surname?: string;
        is_living?: boolean;
    }) => {
        const params = new URLSearchParams();
        if (filters?.generation) params.append('generation', filters.generation.toString());
        if (filters?.surname) params.append('surname', filters.surname);
        if (filters?.is_living !== undefined) params.append('is_living', filters.is_living.toString());
        const query = params.toString() ? `?${params}` : '';
        return fetchApi<any[]>(`/people${query}`);
    },

    // Lấy chi tiết person
    get: async (handle: string) => {
        return fetchApi<any>(`/people/${handle}`);
    },

    // Tạo person mới
    create: async (personData: {
        handle: string;
        display_name: string;
        gender: number;
        generation: number;
        surname?: string;
        first_name?: string;
        birth_year?: number;
        death_year?: number;
        is_living?: boolean;
        phone?: string;
        email?: string;
        current_address?: string;
        hometown?: string;
        occupation?: string;
        notes?: string;
    }) => {
        return fetchApi('/people', {
            method: 'POST',
            body: JSON.stringify(personData),
        });
    },

    // Cập nhật person
    update: async (handle: string, updateData: Record<string, any>) => {
        return fetchApi(`/people/${handle}`, {
            method: 'PATCH',
            body: JSON.stringify(updateData),
        });
    },

    // Xóa person
    delete: async (handle: string) => {
        return fetchApi(`/people/${handle}`, {
            method: 'DELETE',
        });
    },

    // Dịch chuyển thế hệ
    shiftGenerations: async (amount: number) => {
        return fetchApi('/people/shift-generations', {
            method: 'POST',
            body: JSON.stringify({ amount }),
        });
    },
};

// ==================== EVENTS API ====================

export const eventsApi = {
    // Lấy danh sách events
    list: async () => {
        return fetchApi<any[]>('/events');
    },

    // Tạo event mới
    create: async (eventData: {
        title: string;
        description?: string;
        start_at: string;
        location?: string;
        type?: string;
        creator_id: string;
    }) => {
        return fetchApi('/events', {
            method: 'POST',
            body: JSON.stringify(eventData),
        });
    },

    // RSVP cho event
    rsvp: async (eventId: string, userId: string, status: 'going' | 'maybe' | 'not_going') => {
        return fetchApi(`/events/${eventId}/rsvp`, {
            method: 'POST',
            body: JSON.stringify({ user_id: userId, status }),
        });
    },
};
