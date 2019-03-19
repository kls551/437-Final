# 437-Final
# Housing WebApp for csc-437 Web Development

### Members
- Kyaw Soe
- Ally (Lien) Quan

### Proposal
We plan to make a Housing Posting Webapp using Rest and ReactJS front end. In our WebApp, users will need to register an account for posting their housing. Users can make a post, or posts for their properties with details such as housing descriptions, price, photos and contact info. Users will use email or phone number to communicate and negotiate. On the main page, there will be a list of posting sorted by the posting date, and users will be able to click on the posting to get the details such as images, description, poster’s email, and phone number.

We can implement a sorting option where users will be able to limit the list either by the price range (maybe by a slider), or numbers of bedrooms in the house, so that users will be able to browse their requirements easier.

### Documents
- [All Documents](https://drive.google.com/drive/folders/1xLQP95impQ9FOxUaTYIoMtlZDIcZyMy1?usp=sharing)
- [REST Specification](https://docs.google.com/document/d/14pyPiYUJQi9DTNZDUw7nbITFzkAuk3mihc8zx2w_mU0/edit?usp=sharing)
- React (15.5.4)
- React Bootstrap (0.31.5)

### Notes
Image is handled by path.
- Works with both local and interfile image paths
- You can manage/tranform images through Cloudinary

### To Start the webPage
First you will need Cloudinary Account.
Just go to [Cloudinary](https://cloudinary.com/) to create an account and to Setup.

#### Cloudinary Setup
You will need to set up dotenv (npm module) for handling environment variable
To set up:
- Make a `config.env` inside your main directory
- Put your Cloudinary information in `config.env`
- Format:
```
CLOUD_NAME=<name>
API_KEY=<API_key>
API_SECRET=<API_Secret>
```

