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

import AllIngredients from '../AllIngredients';
import AddIngredient from '../AddIngredient';

import { s3Upload, s3Delete } from '../../../libs/awsLib';

import './index.scss';

class Recipe extends Component {
  static propTypes = {
    // authenticate: PropTypes.func,
    // isAuthenticated: PropTypes.bool,
    // user: PropTypes.object,
    // userId: PropTypes.string
    recipe: PropTypes.object
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
    // this.setRecipe();
  }

  // setRecipe = async () => {
  //   const recipe = this.props.navigation.getParam('recipe');
  //   let attachmentPath;
  //   if (recipe.attachment) {
  //     attachmentPath = await Storage.vault.get(recipe.attachment);
  //   }
  //   this.setState({
  //     title: recipe.title,
  //     ingredients: recipe.ingredients,
  //     instructions: recipe.instructions,
  //     date: recipe.createdAt,
  //     id: recipe.recipeId,
  //     attachment: recipe.attachment,
  //     attachmentURL: attachmentPath
  //   });
  // }

  // onChangeText = (key, value) => {
  //   this.setState({
  //     [key]: value
  //   });
  // }

  // checkEmptyIngredients = () => {
  //   const { ingredients } = this.state;
  //   const updatedIngredients = new Array(ingredients);
    
  //   updatedIngredients[0].map((item, index) => {
  //     if (item.length === 0) {
  //       ingredients.splice(index, 1);
  //     }
  //   });

  //   this.setState({
  //     ingredients: updatedIngredients[0]
  //   });
  // }

  // handleUpdate = async () => {
  //   // console.log('handle update');
  
  //   if (this.state.newAttachment) {
  //     let fileInfo = await FileSystem.getInfoAsync(this.state.newAttachment, { size: true });
  //     // console.log('file size: ', fileInfo.size);
    
  //     if (this.state.imageObject && (fileInfo.size > config.s3.MAX_FILE_SIZE)) {
  //       alert("Please choose a file smaller than 5MB");
  //       return;
  //     }
  //   }
  
  //   this.setState({ isUpdating: true });

  //   this.checkEmptyIngredients();
  
  //   try {
  //     if (this.state.imageObject !== null) {
  //       const newAttachment = await s3Upload(this.state.imageObject);
  //       const attachmentPath = await Storage.vault.get(newAttachment);
  //       await s3Delete(this.state.attachment);
  //       this.setState({
  //         attachment: newAttachment,
  //         attachmentURL: attachmentPath
  //       });
  //     }
  //     await this.updateRecipe({
  //       title: this.state.title,
  //       ingredients: this.state.ingredients,
  //       instructions: this.state.instructions,
  //       attachment: this.state.attachment
  //     });
  //     this.setState({
  //       isUpdating: false,
  //       editMode: false
  //     });
  //   } catch (e) {
  //     console.log(e);
  //     this.setState({ isUpdating: false });
  //   }
  // }

  // updateRecipe = (recipe) => {
  //   return API.put('recipes', `/recipes/${this.state.id}`, {
  //     body: recipe
  //   });
  // }

  // deleteRecipe() {
  //   const { id } = this.state;
  //   return API.del('recipes', `/recipes/${id}`);
  // }

  // confirmDeleteRecipe = () => {
  //   // console.log('confirm delete');
  //   Alert.alert(
  //     'Delete Recipe',
  //     'Are you sure you want to delete this recipe?',
  //     [
  //       // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
  //       {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
  //       {text: 'OK', onPress: () => this.handleDelete()},
  //     ],
  //     { cancelable: false }
  //   )
  // }
  
  // handleDelete = async () => {
  //   // console.log('handle delete');
  
  //   this.setState({ isDeleting: true });
  
  //   try {
  //     await s3Delete(this.state.attachment);
  //     await this.deleteRecipe();
  //     this.setState({ isDeleting: false });
  //     this.props.navigation.goBack();
  //   } catch (e) {
  //     console.log('handleDelete error: ', e);
  //     this.setState({ isDeleting: false });
  //   }
  // }

  // deleteImage = async () => {
  //   try {
  //     await s3Delete(this.state.attachment);
  //     this.setState({
  //       attachment: '',
  //       attachmentURL: ''
  //     });
  //   } catch (e) {
  //     console.log('deleteImage error: ', e);
  //   }
  // }

  // confirmDeleteImage = () => {
  //   // console.log('confirm delete');
  //   Alert.alert(
  //     'Delete Image',
  //     'Are you sure you want to delete this image?',
  //     [
  //       // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
  //       {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
  //       {text: 'OK', onPress: () => this.deleteImage()},
  //     ],
  //     { cancelable: false }
  //   )
  // }

  // handleEdit = () => {
  //   this.setState(prevState => ({
  //     editMode: !prevState.editMode
  //   }));
  // }

  // handleImageButton = async () => {
  //   if (Platform.OS === 'ios') {
  //     const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  //     if (status === 'granted') {
  //       this.chooseImage();
  //     } else {
  //       const error = 'Camera Roll permission not granted';
  //       console.log('error: ', error);
  //       throw new Error(error);
  //     }
  //   } else {
  //     this.chooseImage();
  //   }
  // }

  // chooseImage = () => {
  //   ImagePicker.launchImageLibraryAsync({
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //   })
  //   .then(result => {
  //     if (result && !result.cancelled) {
  //       this.setState({
  //         imageObject: result,
  //         attachmentURL: result.uri
  //       });
  //     }
  //   })
  //   .catch((err) => {
  //       console.log('ImagePicker error: ', err);
  //   });
  // }

  // recipeImage = () => {
  //   const { editMode, attachmentURL } = this.state;

  //   if (editMode) {
  //     return (
  //       attachmentURL
  //       ? <View>
  //           <Image
  //             style={recipeStyles.recipeHeaderImg}
  //             source={{ uri: attachmentURL }}
  //             resizeMode={'cover'}
  //           />
  //           <View style={recipeStyles.recipeHeaderButtons}>
  //             <TouchableOpacity
  //               onPress={this.confirmDeleteImage}
  //               title="Delete image"
  //               style={recipeStyles.recipeHeaderButton}
  //             >
  //               <Ionicons name={Platform.OS === 'ios' ? `ios-trash` : 'md-trash'} size={15} color={'white'} />
  //               <Text style={{ color: 'white' }}> Delete image</Text>
  //             </TouchableOpacity>
  //             <TouchableOpacity
  //               onPress={this.handleImageButton}
  //               title="Change image"
  //               style={recipeStyles.recipeHeaderButton}
  //             >
  //               <Ionicons name={Platform.OS === 'ios' ? `ios-create` : 'md-create'} size={15} color={'white'} />
  //               <Text style={{ color: 'white' }}> Change image</Text>
  //             </TouchableOpacity>
  //           </View>
  //           <View style={{ width: '100%' }}>
  //             <LinearGradient
  //               colors={['transparent', '#000']}
  //               start={[0, 0]}
  //               end={[0, 1]}
  //               style={[recipeStyles.recipeHeaderContent, { paddingBottom: 10 }]}
  //             >
                
  //             </LinearGradient>
  //           </View>
  //         </View>
  //       : <View style={[recipeStyles.recipeHeaderContent, recipeStyles.recipeHeaderContentEdit]}>
  //           <TouchableOpacity
  //             onPress={this.handleImageButton}
  //             title="Add image"
  //             style={recipeStyles.recipeHeaderButton}
  //           >
  //             <Text>{"\uFF0B"} Add image</Text>
  //           </TouchableOpacity>
  //         </View>
  //     )
  //   }
  //   return (
  //     attachmentURL
  //     ? <Image
  //         style={recipeStyles.recipeHeaderImg}
  //         source={{ uri: attachmentURL }}
  //         resizeMode={'cover'}
  //       />
  //     : null
  //   )
  // }

  // recipeHeader = () => {
  //   const { editMode, title } = this.state;
  //   const recipeImage = this.recipeImage();

  //   if (editMode) {
  //     return (
  //       <View style={[recipeStyles.recipeHeader, { backgroundColor: 'white' }]}>
  //         {recipeImage}
  //         <View style={[recipeStyles.recipeHeaderContent, recipeStyles.recipeHeaderContentEdit]}>
  //           <Text style={[globalStyles.subHeading]}>Title</Text>
  //         </View>
  //         <View style={[recipeStyles.recipeHeaderContent, recipeStyles.recipeHeaderContentEdit]}>
  //           <TextInput
  //             style={[formStyles.textInput, formStyles.textEdit, formStyles.textEditHeader, {maxWidth: 300}]}
  //             value={title}
  //             onChangeText={value => this.onChangeText('title', value)}
  //             placeholder={title}
  //             underlineColorAndroid="transparent"
  //           />
  //         </View>
  //       </View>
  //     )
  //   }
    
  //   return (
  //     <View style={recipeStyles.recipeHeader}>
  //       {recipeImage}
  //       <View style={{ width: '100%' }}>
  //         <LinearGradient
  //           colors={['transparent', '#000']}
  //           start={[0, 0]}
  //           end={[0, 1]}
  //           style={recipeStyles.recipeHeaderContent}
  //         >
  //           <Text style={[globalStyles.heading, recipeStyles.recipeHeaderCopy]}>{title}</Text>
  //         </LinearGradient>
  //         {/* <Text style={globalStyles.smallText}>{new Date(date).toLocaleDateString()}</Text> */}
  //       </View>
  //     </View>
  //   )
  // }

  // addIngredient = () => {
  //   const { ingredients } = this.state;
  //   const newIngredient = { name: null, amount: null, unit: null}
  //   const updatedIngredients = new Array(ingredients);

  //   updatedIngredients[0].push(newIngredient);
  //   console.log('updatedIngredients: ', updatedIngredients);
  //   this.setState({
  //     ingredients: updatedIngredients[0]
  //   });
  // }

  // handleIngredientsChange = (i, name, amount, unit) => {
  //   console.log('handleIngredientsChange: ', (i, name, amount, unit));
  //   const { ingredients } = this.state;
  //   const updatedIngredients = new Array(ingredients);

  //   updatedIngredients[0][i].name = name;
  //   updatedIngredients[0][i].amount = amount;
  //   updatedIngredients[0][i].unit = unit;
  //   console.log('updatedIngredients: ', updatedIngredients);

  //   this.setState({
  //     ingredients: updatedIngredients[0]
  //   });
  // }

  // ingredientDelete = (i) => {
  //   console.log('handleIngredientsChange: ', i);
  //   const { ingredients } = this.state;
  //   const updatedIngredients = new Array(ingredients);

  //   updatedIngredients[0].splice(i, 1);
  //   console.log('updatedIngredients: ', updatedIngredients);

  //   this.setState({
  //     ingredients: updatedIngredients[0]
  //   });
  // }

  // editToggleButton = () => {
  //   const { editMode } = this.state;
    
  //   if (editMode) {
  //     return (
  //       <TouchableOpacity
  //         type="submit"
  //         style={recipeStyles.actionButton}
  //         onPress={this.handleUpdate}
  //         title="Save Changes"
  //         accessibilityLabel="Save Changes"
  //       >
  //         <Ionicons name={Platform.OS === 'ios' ? `ios-checkmark-circle` : 'md-checkmark-circle'} size={25} color={Colors.sageGreen} />
  //       </TouchableOpacity>
  //     )
  //   }
  //   return (
  //     <TouchableOpacity
  //       type="submit"
  //       style={recipeStyles.actionButton}
  //       onPress={this.handleEdit}
  //       title="Edit Recipe"
  //       accessibilityLabel="Edit Recipe"
  //     >
  //       <Ionicons name={Platform.OS === 'ios' ? `ios-create` : 'md-create'} size={35} color={Colors.sageGreen} />
  //     </TouchableOpacity>
  //   )
  // }

  // instructions = () => {
  //   const { editMode, instructions } = this.state;

  //   if (editMode) {
  //     return (
  //       <TextInput
  //         style={formStyles.textInput}
  //         multiline
  //         numberOfLines={10}
  //         value={instructions}
  //         onChangeText={value => this.onChangeText('instructions', value)}
  //         placeholder={instructions}
  //         underlineColorAndroid="transparent"
  //       />
  //     )
  //   }
  //   return (
  //     <Text>{instructions}</Text>
  //   )
  // }

  render() {
    const {
      ingredients,
      editMode
    } = this.state;
    // const recipeHeader = this.recipeHeader(),
    //       instructions = this.instructions(),
    //       editToggleButton = this.editToggleButton();
    console.log('this.state.ingredients: ', ingredients);

    return (
      <div>
        <h1>{this.props.recipe.title}</h1>
      </div>
    );
  }

}

export default Recipe;
