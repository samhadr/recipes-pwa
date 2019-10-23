import React from 'react';
import PropTypes from 'prop-types';
// import { TouchableOpacity, Text } from 'react-native';

// import Colors from '../constants/Colors';

const AddIngredient = (props) => {
	return (
		<div
			onClick={props.handleOnPress}
			// title="Add Ingredient"
			// style={{ alignSelf: 'flex-start', paddingBottom: 10 }}
		>
			<p /*style={{ fontWeight: 'bold', color: Colors.sageGreen }}*/>{"\uFF0B"} Add Ingredient</p>
		</div>
	)
}

AddIngredient.propTypes = {
	handleOnPress: PropTypes.func.isRequired
}

export default AddIngredient;