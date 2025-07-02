import { Box } from "@mui/material";

interface headerProps {
  text: string | undefined;
}

export const Header = (props: headerProps) => {
  const { text } = props;
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#3C4042",
        flex: 1,
        display: "flex",
        padding: "0 2rem 0 2rem",
        alignItems: "center",
      }}
    >
      <h2>{text === undefined ? "Welcome" : text}</h2>
    </Box>
  );
};
