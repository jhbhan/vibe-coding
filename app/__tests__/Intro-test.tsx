import { render } from '@testing-library/react-native';
import HomeScreen from '../(tabs)';

test('renders correctly', () => {
    const tree = render(<HomeScreen />);
    expect(tree).toMatchSnapshot();
});