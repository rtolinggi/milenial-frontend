import {
  ActionIcon,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";

// import type { ActionIconVariant } from "@mantine/core";
import { HiOutlineSun, HiMoon } from "react-icons/hi2";

type Props = {
  // variant?: ActionIconVariant;
  size?: number;
};
const DarkMode: React.FC<Props> = ({ size }) => {
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <ActionIcon
      // variant={variant}
      color={theme.primaryColor}
      onClick={() => toggleColorScheme()}
      title="Dark Mode">
      {dark ? (
        <HiOutlineSun size={size || 24} />
      ) : (
        <HiMoon size={size || 21} />
      )}
    </ActionIcon>
  );
};

export default DarkMode;
