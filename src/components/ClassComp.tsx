import { Component, ReactNode } from "react";
import { Button, Text, View } from "react-native";

type ClassCompType = {
  name?: string;
  age?: number;
  children?: ReactNode; //children props
};

type StateType = {
  counter: number;
};

class ClassComp extends Component<ClassCompType, StateType> {
  static defaultProps: Partial<ClassCompType> = {
    name: "Default name",
    age: 10,
  };

  up = () => {
    this.setState((prevState) => ({
      counter: prevState.counter + 1,
    }));
  };

  constructor(props: ClassCompType) {
    super(props);
    this.state = { counter: 0 };
  }
  render(): ReactNode {
    const { name, age } = this.props;
    return (
      <View>
        <Text>
          Name: {name} Age: {age}
        </Text>
        <Text>{this.state.counter}</Text>
        <Button title="UP" onPress={() => this.up()} />
      </View>
    );
  }
}
export default ClassComp;
