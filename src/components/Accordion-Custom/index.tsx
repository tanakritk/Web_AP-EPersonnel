import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface AccordionCustomProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  backgroundWhite?: boolean;
}

const AccordionCustom = ({
  title,
  children,
  defaultExpanded,
  backgroundWhite=false
}: AccordionCustomProps): JSX.Element => {
  return (
    <>
      <Accordion
        defaultExpanded={defaultExpanded || false}
        sx={{ borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
          aria-controls="panel1-content"
          color="primary"
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <span className="text-lg font-semibold text-white">{title}</span>
        </AccordionSummary>
        <AccordionDetails className={`${backgroundWhite ? "bg-white" : "bg-gray-100"}`}>
          {children}
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default AccordionCustom;
