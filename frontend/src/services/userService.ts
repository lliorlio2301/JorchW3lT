import api from './api';

const ENDPOINT = '/user';

export const userService = {
    updateUsername: async (newUsername: string): Promise<void> => {
        await api.put(`${ENDPOINT}/update-username`, { newUsername });
    },

    updatePassword: async (newPassword: string): Promise<void> => {
        await api.put(`${ENDPOINT}/update-password`, { newPassword });
    }
};

export default userService;
