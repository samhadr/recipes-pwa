import App from './containers/App';
import SignIn from './containers/SignIn';
import Recipes from './containers/Recipes';
import SingleRecipe from './components/Recipe';
import CreateRecipe from './components/CreateRecipe';

const routes = [
  { path: '/',
    exact: true,
    title: 'Home',
    component: App
  },
  { path: '/sign-in',
    exact: true,
    title: 'Sign In',
    component: SignIn
  },
  { path: '/recipes',
    exact: true,
    title: 'Recipes',
    component: Recipes,
    routes: [
      {
        path: "/recipes/:title",
        component: SingleRecipe
      }
    ]
  },
  { path: '/create-recipe',
    exact: true,
    title: 'Create Recipe',
    component: CreateRecipe
  }
];

export default routes;
