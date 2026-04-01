import api from './api';

const ENDPOINT = '/users';

export const userService = {
    updateUsername: async (newUsername: string): Promise<void> => {
        await api.put(`${ENDPOINT}/account`, { newUsername });
    },

    updatePassword: async (newPassword: string): Promise<void> => {
        await api.put(`${ENDPOINT}/account`, { newPassword });
    }
};

export default userService;
