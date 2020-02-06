import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import {
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
//   Platform
// } from 'react-native';

// import formStyles from '../styles/FormStyles';
// import recipeStyles from '../styles/RecipeStyles';
// import Colors from '../constants/Colors';

// import { Ionicons } from '@expo/vector-icons';

class SingleIngredient extends Component {
  static propTypes = {
    index: PropTypes.number,
    name: PropTypes.string,
    amount: PropTypes.string,
    unit: PropTypes.string,
    editMode: PropTypes.bool
  }

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      amount: '',
      unit: ''
    }
  }

  componentDidMount() {
    this.setValues();
  }

  setValues = () => {
    this.setState({
      name: this.props.name,
      amount: this.props.amount,
      unit: this.props.unit
    });
  }

  onChangeText = (key, event) => {
    const target = event.target;
    const value = target.value;

    this.setState({
      [key]: value
    });
  }

  handleChange = (i) => {
    const { name, amount, unit } = this.state;
    console.log('handleChange: ', (i));
    this.props.onIngredientChange(i, name, amount, unit);
  }

  handleDelete = (i) => {
    console.log('handleDelete: ', i);
    this.props.onIngredientDelete(i);
  }

  renderSingleIngredient = () => {
    const { index, editMode } = this.props;
    const { name, amount, unit } = this.state;
    console.log('single state: ', this.state);

    if (editMode) {
      return (
        <div style={{ flexDirection: 'row' }}>
          <input
            type="text"
            // style={[formStyles.textInput, formStyles.textEdit, { flex: 1 }]}
            value={amount ? amount : ''}
            onChange={value => this.onChangeText('amount', value)}
            // onBlur={() => this.handleChange(index, 'amount', amount)}
            placeholder={amount ? amount : 'amount'}
            // underlineColorAndroid="transparent"
          />
          <input
            type="text"
            // style={[formStyles.textInput, formStyles.textEdit, { flex: 3 }]}
            value={unit ? unit : ''}
            onChange={value => this.onChangeText('unit', value)}
            // onBlur={() => this.handleChange(index, 'unit', unit)}
            placeholder={unit ? unit : 'unit'}
            // underlineColorAndroid="transparent"
          />
          <input
            type="text"
            // style={[formStyles.textInput, formStyles.textEdit, { flex: 8 }]}
            value={name ? name : ''}
            onChange={value => this.onChangeText('name', value)}
            // onBlur={() => this.handleChange(index, 'name', name)}
            placeholder={name ? name : 'name'}
            // underlineColorAndroid="transparent"
          />
          <div
            type="submit"
            // style={recipeStyles.actionButton}
            onClick={() => this.handleChange(index)}
            // title="Save Ingredient"
            // accessibilityLabel="Save Ingredient"
          >
            Save Ingredient
            {/* <Ionicons name={Platform.OS === 'ios' ? `ios-checkmark-circle` : 'md-checkmark-circle'} size={25} color={Colors.sageGreen} /> */}
          </div>
          <div
            type="submit"
            // style={recipeStyles.actionButton}
            onClick={() => this.handleDelete(index)}
            // title="Delete Ingredient"
            // accessibilityLabel="Delete Ingredient"
          >
            Delete Ingredient
            {/* <Ionicons name={Platform.OS === 'ios' ? `ios-trash` : 'md-trash'} size={25} color={Colors.sageGreen} /> */}
          </div>
        </div>
      )
    }
    return (
      <p>
        {amount ? amount : null} {unit ? unit : null} {name ? name : null}
      </p>
    )
  }

  render() {
    const ingredient = this.renderSingleIngredient();
    
    return (
      <div className="ingredient">
        {ingredient}
      </div>
    )
  }
}

export default SingleIngredient;