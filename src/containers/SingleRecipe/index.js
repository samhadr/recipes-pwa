import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import {
//   Text,
//   TouchableOpacity,
//   View,
//   TextInput,
//   ScrollView,
//   Alert,
//   Image,
//   Platform,
// } from 'react-native';

import { API, Storage } from 'aws-amplify';

// import { ImagePicker, Permissions, FileSystem, LinearGradient } from 'expo';

import AllIngredients from '../../components/AllIngredients';
import AddIngredient from '../../components/AddIngredient';

import { s3Upload, s3Delete } from '../../../libs/awsLib';

// import globalStyles from '../styles/GlobalStyles';
// import formStyles from '../styles/FormStyles';
// import recipeStyles from '../styles/RecipeStyles';

// import Colors from '../constants/Colors';

// import { Ionicons } from '@expo/vector-icons';

class SingleRecipe extends Component {

  static propTypes = {
    authenticate: PropTypes.func,
    isAuthenticated: PropTypes.bool,
    user: PropTypes.object,
    userId: PropTypes.string
  }

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      title: '',
      ingredients: null,
      instructions: '',
      date: 0,
      id: '',
      attachment: '',
      attachmentURL: '',
      newAttachment: '',
      imageObject: null,
      editMode: false,
      isUpdating: false,
      isDeleting: false
    }
  }

  componentDidMount() {
    this.setRecipe();
  }

  setRecipe = async () => {
    const recipe = this.props.navigation.getParam('recipe');
    let attachmentPath;
    if (recipe.attachment) {
      attachmentPath = await Storage.vault.get(recipe.attachment);
    }
    this.setState({
      title: recipe.title,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      date: recipe.createdAt,
      id: recipe.recipeId,
      attachment: recipe.attachment,
      attachmentURL: attachmentPath
    });
  }

  onChangeText = (key, value) => {
    this.setState({
      [key]: value
    });
  }

  checkEmptyIngredients = () => {
    const { ingredients } = this.state;
    const updatedIngredients = new Array(ingredients);
    
    updatedIngredients[0].map((item, index) => {
      if (item.length === 0) {
        ingredients.splice(index, 1);
      }
    });

    this.setState({
      ingredients: updatedIngredients[0]
    });
  }

  handleUpdate = async () => {
    // console.log('handle update');
  
    if (this.state.newAttachment) {
      let fileInfo = await FileSystem.getInfoAsync(this.state.newAttachment, { size: true });
      // console.log('file size: ', fileInfo.size);
    
      if (this.state.imageObject && (fileInfo.size > config.s3.MAX_FILE_SIZE)) {
        alert("Please choose a file smaller than 5MB");
        return;
      }
    }
  
    this.setState({ isUpdating: true });

    this.checkEmptyIngredients();
  
    try {
      if (this.state.imageObject !== null) {
        const newAttachment = await s3Upload(this.state.imageObject);
        const attachmentPath = await Storage.vault.get(newAttachment);
        await s3Delete(this.state.attachment);
        this.setState({
          attachment: newAttachment,
          attachmentURL: attachmentPath
        });
      }
      await this.updateRecipe({
        title: this.state.title,
        ingredients: this.state.ingredients,
        instructions: this.state.instructions,
        attachment: this.state.attachment
      });
      this.setState({
        isUpdating: false,
        editMode: false
      });
    } catch (e) {
      console.log(e);
      this.setState({ isUpdating: false });
    }
  }

  updateRecipe = (recipe) => {
    return API.put('recipes', `/recipes/${this.state.id}`, {
      body: recipe
    });
  }

  deleteRecipe() {
    const { id } = this.state;
    return API.del('recipes', `/recipes/${id}`);
  }

  confirmDeleteRecipe = () => {
    // console.log('confirm delete');
    Alert.alert(
      'Delete Recipe',
      'Are you sure you want to delete this recipe?',
      [
        // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => this.handleDelete()},
      ],
      { cancelable: false }
    )
  }
  
  handleDelete = async () => {
    // console.log('handle delete');
  
    this.setState({ isDeleting: true });
  
    try {
      await s3Delete(this.state.attachment);
      await this.deleteRecipe();
      this.setState({ isDeleting: false });
      this.props.navigation.goBack();
    } catch (e) {
      console.log('handleDelete error: ', e);
      this.setState({ isDeleting: false });
    }
  }

  deleteImage = async () => {
    try {
      await s3Delete(this.state.attachment);
      this.setState({
        attachment: '',
        attachmentURL: ''
      });
    } catch (e) {
      console.log('deleteImage error: ', e);
    }
  }

  confirmDeleteImage = () => {
    // console.log('confirm delete');
    Alert.alert(
      'Delete Image',
      'Are you sure you want to delete this image?',
      [
        // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => this.deleteImage()},
      ],
      { cancelable: false }
    )
  }

  handleEdit = () => {
    this.setState(prevState => ({
      editMode: !prevState.editMode
    }));
  }

  handleImageButton = async () => {
    if (Platform.OS === 'ios') {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status === 'granted') {
        this.chooseImage();
      } else {
        const error = 'Camera Roll permission not granted';
        console.log('error: ', error);
        throw new Error(error);
      }
    } else {
      this.chooseImage();
    }
  }

  chooseImage = () => {
    ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    })
    .then(result => {
      if (result && !result.cancelled) {
        this.setState({
          imageObject: result,
          attachmentURL: result.uri
        });
      }
    })
    .catch((err) => {
        console.log('ImagePicker error: ', err);
    });
  }

  recipeImage = () => {
    const { editMode, attachmentURL } = this.state;

    if (editMode) {
      return (
        attachmentURL
        ? <div>
            <img
              // style={recipeStyles.recipeHeaderImg}
              src={{ uri: attachmentURL }}
              // resizeMode={'cover'}
            />
            <div /*style={recipeStyles.recipeHeaderButtons}*/>
              <div
                onClick={this.confirmDeleteImage}
                // title="Delete image"
                // style={recipeStyles.recipeHeaderButton}
              >
                {/* <Ionicons name={Platform.OS === 'ios' ? `ios-trash` : 'md-trash'} size={15} color={'white'} /> */}
                <p> Delete image</p>
              </div>
              <div
                onClick={this.handleImageButton}
                // title="Change image"
                // style={recipeStyles.recipeHeaderButton}
              >
                {/* <Ionicons name={Platform.OS === 'ios' ? `ios-create` : 'md-create'} size={15} color={'white'} /> */}
                <p> Change image</p>
              </div>
            </div>
            {/* <div style={{ width: '100%' }}>
              <LinearGradient
                colors={['transparent', '#000']}
                start={[0, 0]}
                end={[0, 1]}
                style={[recipeStyles.recipeHeaderContent, { paddingBottom: 10 }]}
              >
                
              </LinearGradient>
            </div> */}
          </div>
        : <div style={[recipeStyles.recipeHeaderContent, recipeStyles.recipeHeaderContentEdit]}>
            <div
              onClick={this.handleImageButton}
              // title="Add image"
              // style={recipeStyles.recipeHeaderButton}
            >
              <p>{"\uFF0B"} Add image</p>
            </div>
          </div>
      )
    }
    return (
      attachmentURL
      ? <img
          // style={recipeStyles.recipeHeaderImg}
          src={{ uri: attachmentURL }}
          // resizeMode={'cover'}
        />
      : null
    )
  }

  recipeHeader = () => {
    const { editMode, title } = this.state;
    const recipeImage = this.recipeImage();

    if (editMode) {
      return (
        <div /*style={[recipe/*s.recipeHeader, { backgroundColor: 'white' }]}*/>
          {recipeImage}
          <div /*style={[recipeStyles.recipeHeaderContent, recipeStyles.recipeHeaderContentEdit]}*/>
            <Text style={[globalStyles.subHeading]}>Title</Text>
          </div>
          <div /*style={[recipeStyles.recipeHeaderContent, recipeStyles.recipeHeaderContentEdit]}*/>
            <TextInput
              style={[formStyles.textInput, formStyles.textEdit, formStyles.textEditHeader, {maxWidth: 300}]}
              value={title}
              onChangeText={value => this.onChangeText('title', value)}
              placeholder={title}
              underlineColorAndroid="transparent"
            />
          </div>
        </div>
      )
    }
    
    return (
      <div /*style={recipeStyles.recipeHeader}*/>
        {recipeImage}
        {/* <div style={{ width: '100%' }}>
          <LinearGradient
            colors={['transparent', '#000']}
            start={[0, 0]}
            end={[0, 1]}
            style={recipeStyles.recipeHeaderContent}
          >
            <Text style={[globalStyles.heading, recipeStyles.recipeHeaderCopy]}>{title}</Text>
          </LinearGradient>
        </div> */}
      </div>
    )
  }

  addIngredient = () => {
    const { ingredients } = this.state;
    const newIngredient = { name: null, amount: null, unit: null}
    const updatedIngredients = new Array(ingredients);

    updatedIngredients[0].push(newIngredient);
    console.log('updatedIngredients: ', updatedIngredients);
    this.setState({
      ingredients: updatedIngredients[0]
    });
  }

  handleIngredientsChange = (i, name, amount, unit) => {
    console.log('handleIngredientsChange: ', (i, name, amount, unit));
    const { ingredients } = this.state;
    const updatedIngredients = new Array(ingredients);

    updatedIngredients[0][i].name = name;
    updatedIngredients[0][i].amount = amount;
    updatedIngredients[0][i].unit = unit;
    console.log('updatedIngredients: ', updatedIngredients);

    this.setState({
      ingredients: updatedIngredients[0]
    });
  }

  ingredientDelete = (i) => {
    console.log('handleIngredientsChange: ', i);
    const { ingredients } = this.state;
    const updatedIngredients = new Array(ingredients);

    updatedIngredients[0].splice(i, 1);
    console.log('updatedIngredients: ', updatedIngredients);

    this.setState({
      ingredients: updatedIngredients[0]
    });
  }

  editToggleButton = () => {
    const { editMode } = this.state;
    
    if (editMode) {
      return (
        <div
          type="submit"
          // style={recipeStyles.actionButton}
          onClick={this.handleUpdate}
          // title="Save Changes"
          // accessibilityLabel="Save Changes"
        >
          Save Changes
          {/* <Ionicons name={Platform.OS === 'ios' ? `ios-checkmark-circle` : 'md-checkmark-circle'} size={25} color={Colors.sageGreen} /> */}
        </div>
      )
    }
    return (
      <div
        type="submit"
        // style={recipeStyles.actionButton}
        onClick={this.handleEdit}
        // title="Edit Recipe"
        // accessibilityLabel="Edit Recipe"
      >
        Edit Recipe
        {/* <Ionicons name={Platform.OS === 'ios' ? `ios-create` : 'md-create'} size={35} color={Colors.sageGreen} /> */}
      </div>
    )
  }

  instructions = () => {
    const { editMode, instructions } = this.state;

    if (editMode) {
      return (
        <input
          // style={formStyles.textInput}
          type="text"
          multiline
          // numberOfLines={10}
          value={instructions}
          onChangeText={value => this.onChangeText('instructions', value)}
          placeholder={instructions}
          // underlineColorAndroid="transparent"
        />
      )
    }
    return (
      <p>{instructions}</p>
    )
  }

  render() {
    const {
      ingredients,
      editMode
    } = this.state;
    const recipeHeader = this.recipeHeader(),
          instructions = this.instructions(),
          editToggleButton = this.editToggleButton();
    console.log('this.state.ingredients: ', ingredients);

    return (
      <div>
        {recipeHeader}
        <div /*style={globalStyles.container}*/>
          <div>
            <div /*style={[globalStyles.contentBox, { flexDirection: 'row' }]}*/>
              <div /*style={recipeStyles.ingredients}*/>
                <p /*style={globalStyles.subHeading}*/>Ingredients</p>
                {
                  ingredients
                  ?
                  <AllIngredients
                    ingredients={ingredients}
                    editMode={editMode}
                    onIngredientsChange={this.handleIngredientsChange}
                    onIngredientDelete={this.ingredientDelete}
                  />
                  :
                  null
                }
                {
                  editMode
                  ?
                  <AddIngredient
                    handleOnPress={() => this.addIngredient()}
                  />
                  :
                  null
                }
              </div>
              <div /*style={recipeStyles.actionButtons}*/>
                {editToggleButton}
                <div
                  type="submit"
                  // style={recipeStyles.actionButton}
                  onClick={this.confirmDeleteRecipe}
                  // title="Delete Recipe"
                  // accessibilityLabel="Delete Recipe"
                >
                  Delete Recipe
                  {/* <Ionicons name={Platform.OS === 'ios' ? `ios-trash` : 'md-trash'} size={35} color={Colors.sageGreen} /> */}
                </div>
              </div>
            </div>
            <div /*style={globalStyles.contentBox}*/>
              <Text /*style={globalStyles.subHeading}*/>Instructions</Text>
              {instructions}
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default SingleRecipe;
