import conf from '../conf/conf.js';
import { Client, ID, Databases, Query } from 'appwrite';

export class Service{
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client
    .setEndpoint(conf.appwriteURL)
    .setProject(conf.appwriteProjectID)
    // gettin' data from databases based on client
    this.databases = new Databases(this.client) 
    // gettin' data from bucket based on client
    this.bucket = new this.Storage(this.client)
  }

  async createPost({title, slug, content, featuredImage, status, userId}) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseID,
        conf.appwriteCollectionID,
        slug,
        {
          // if want something else to store, add it here and update it to attribute aswell.

          title,
          slug,
          content,
          featuredImage,
          status,
          userId
        }
      )
    } catch (error) {
      console.error('Appwrite service :: CreatePost :: error', error);
    }
  }

  async updatePost(slug, {title, content, featuredImage, status}) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseID,
        conf.appwriteCollectionID,
        slug,
        {
          // changes will be stored
          title,
          content,
          featuredImage,
          status
        }
      )
    } catch (error) {
      console.error('Appwrite service :: updatePost :: error', error)
    }
  }

  async deletePost(slug) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseID,
        conf.appwriteCollectionID,
        slug
      )
      return true
    } catch (error) {
      console.error('Appwrite service :: deletePost :: error', error);
      return false
    }
  }

  async getPost(slug) {
    try {
      return await this.databases.getDocument(
        conf.appwriteDatabaseID,
        conf.appwriteCollectionID,
        slug
      )
    } catch (error) {
      console.error('Appwrite service :: getPost :: error', error);
      return false
    }
  }

  async getPosts(queries = [Query.equal('status', 'active')]) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseID,
        conf.appwriteCollectionID,
        queries,
      )
    } catch (error) {
      console.error('Appwrite service :: getPosts :: error', error); 
      return false
    }
  }

  // file upload service
  async uploadFile(file) {
    try {
      return await this.bucket.createFile(
        conf.appwriteBucketID,
        ID.unique(),
        file
      )
    } catch (error) {
      console.error('Appwrite service :: uploadFile :: error', error);
      return false
    }
  }

  async deleteFile(fileId) {
    try {
      await this.bucket.deleteFile(
        conf.appwriteBucketID,
        fileId
      )
      return true
    } catch (error) {
      console.error('Appwrite service :: deleteFile :: error', error); 
      return false
    }
  }

  // this doesn't need any async becasue it does not doin' any promise or smh
  getFilePreview(fileId) {
    return this.bucket.getFilePreview(
      conf.appwriteBucketID,
      fileId
    )
  }
}


const service = new Service()
export default service;