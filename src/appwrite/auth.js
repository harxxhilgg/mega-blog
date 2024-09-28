/* eslint-disable no-useless-catch */
import conf from '../conf/conf.js';
import { Client, Account, ID } from 'appwrite';


// creating class
export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteURL)
      .setProject(conf.appwriteProjectID)
    this.account = new Account(this.client)
  }

  async createAccount({email, password, name}) {

    // At first, we are goin' to generate ID for user who's trying to create an account, then user's name, email and password will be stored into object and we'll send them to database and use it when user tries to login again.
    try {
        const userAccount = await this.account.create(ID.unique(), email, password, name);

        if (userAccount) {
          // it will direct login when user creates an account, no need to relogin
          return this.login({email, password})         
        } else {
          // if not, redirect to sign-up page
          return userAccount;
        }
    } catch (error) {
        console.error('Appwrite Service :: createAccount :: error', error);
    }
  }

  async login({email, password}) {
    try {
        // logging-in based on email and password that's stored into database.
        return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
        console.error('Appwrite Service :: login :: error', error);
    }
  }

  async getCurrentUser() {
    try {
        // getting current user's info. If logged-in.
        return await this.account.get();
    } catch (error) {
        console.error('Appwrite service :: getCurrentUesr :: error', error);
    }
    
    // if currentUser info is not catched then we'll return null
    return null;
  }

  async logout() {
    try {
        // deleting(logout) all session from any browsers where you're logged in
        await this.account.deleteSessions();
    } catch (error) {
        console.error('Appwrite service :: logout :: error', error)
    }
  }
}

const authService = new AuthService();

export default authService;