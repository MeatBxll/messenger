import { Box, Fab, TextField } from "@mui/material";
import { MdArrowForwardIos } from "react-icons/md";

interface FooterProps {
  isNeeded: boolean;
}

export const Footer = (props: FooterProps) => {
  const { isNeeded } = props;
  if (isNeeded) {
    return (
      <Box
        sx={{
          width: "100%",
          flex: 2,
          bgcolor: "#3C4042",
          display: "flex",
          alignItems: "center",
          padding: "0 2rem 0 2rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            width: "100%",
            justifyContent: "center",
          }}
        >
          <TextField />
          <Fab size="small" color="primary">
            <MdArrowForwardIos />
          </Fab>
        </Box>
      </Box>
    );
  } else {
    <Box
      sx={{
        width: "100%",
        flex: 2,
        display: "flex",
        alignItems: "center",
        padding: "0 2rem 0 2rem",
      }}
    ></Box>;
  }
};
