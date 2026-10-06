import React from "react";
import { Text } from "react-native";
type FuncCompType = {
  name?: string;
  age?: number;
};
const FuncComp = ({
  name = "Default name",
  age = 0,
}: FuncCompType): React.ReactElement => {
  return (
    <Text>
      FC {name} {age}
    </Text>
  );
};
export default FuncComp;
