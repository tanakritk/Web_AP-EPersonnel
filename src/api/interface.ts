interface SortOption {
  field: string;
  pattern: "ASC" | "DESC";
}

export interface FilterOption {
  field: string;
  operator:
    | "like"
    | "="
    | "!="
    | ">"
    | "<"
    | ">="
    | "<="
    | "in"
    | "is null"
    | "is not null"
    | "between"; // เพิ่ม operator อื่นๆ ได้
  value: any;
}

export interface BaseSearchModel {
  page: number;
  limit: number;
  filterOperator: "and" | "or";
  relation?: string[];
  sorting?: SortOption[];
  filter: FilterOption[];
}

export interface BaseSearchQueryModel extends BaseQueryModel {
  paginationData: PaginationModel;
}

export interface BaseQueryModel {
  statusCode: number;
  message: string;
  data: any;
}

export interface PaginationModel {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}
