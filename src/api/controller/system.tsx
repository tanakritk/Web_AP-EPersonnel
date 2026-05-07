import api from "../axios-service";
import { BaseSearchModel, BaseSearchQueryModel } from "../interface";

const rootApi = "/system";
const _SystemApi = () => {
  return {
    search: async (body: BaseSearchModel) => {
      return await api().post<BaseSearchModel, BaseSearchQueryModel>(
        `${rootApi}/search`,
        body,
      );
    },
  };
};

export default _SystemApi;
