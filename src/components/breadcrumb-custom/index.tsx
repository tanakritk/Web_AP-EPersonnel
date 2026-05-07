import { Breadcrumbs } from "@mui/material";
import { Link } from "react-router-dom";
export interface BreadcrumbCustomList {
  label: string;
  path: string;
}

interface BreadcrumbCustomProps {
  list: BreadcrumbCustomList[];
}

const BreadCrumbCustom = ({ list }: BreadcrumbCustomProps) => {

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {list?.map((item: BreadcrumbCustomList, index: number) => (
        <div key={"breadbrumb" + index}>
          {index !== list.length - 1 ? (
            <Link to={{ pathname: item.path }}>
              <span
                className={`font-semibold text-primary-1 hover:underline cursor-pointer`}
              >
                {item.label}
              </span>
            </Link>
          ) : (
            <span
              className={`font-semibold`}
            >
              {item.label}
            </span>
          )}
        </div>
      ))}
    </Breadcrumbs>
  );
};

export default BreadCrumbCustom;
