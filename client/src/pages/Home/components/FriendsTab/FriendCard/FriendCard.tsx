import { Button } from "@mui/material";

interface FriendCardProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pfp: any;
}

export const FriendCard = (props: FriendCardProps) => {
  const { name, pfp } = props;
  return (
    <Button
      variant="contained"
      sx={{
        width: "90%",
        height: "4rem",
        padding: "1rem",
        display: "flex",
        alignItems: "center",
        textTransform: "capitalize",
        gap: "1rem",
        borderRadius: "1rem",
        justifyContent: "left",
      }}
    >
      {pfp}
      <h3>{name}</h3>
    </Button>
  );
};
