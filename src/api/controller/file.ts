import api from "../axios-service";

const rootApi = "/files";

const _FileApi = () => {
  return {
    getFile: async (payload: { path: string }) => {
      return await api().post(`${rootApi}/getfile`, payload);
    },
  };
};

export default _FileApi;
