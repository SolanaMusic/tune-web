const express = require("express");
const https = require("https");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const {
  createNft,
  mplTokenMetadata,
  verifyCollectionV1,
  findMetadataPda,
} = require("@metaplex-foundation/mpl-token-metadata");
const {
  createGenericFile,
  generateSigner,
  keypairIdentity,
  percentAmount,
  publicKey,
} = require("@metaplex-foundation/umi");
const { createUmi } = require("@metaplex-foundation/umi-bundle-defaults");
const { irysUploader } = require("@metaplex-foundation/umi-uploader-irys");
const {
  airdropIfRequired,
  getKeypairFromFile,
} = require("@solana-developers/helpers");
const {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
} = require("@solana/web3.js");

const app = express();
app.use(express.static(path.join(__dirname, "public")));
const port = 8000;

const agent = new https.Agent({
  rejectUnauthorized: false,
});

function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return { r, g, b };
}

app.post("/create-nft", async (req, res) => {
  try {
    const { name, supply, associationId, associationType, currencyId, price } =
      req.query;

    if (
      !name ||
      !supply ||
      !associationId ||
      !associationType ||
      !currencyId ||
      !price
    ) {
      return res.status(400).send("Missing required parameters.");
    }

    console.log("Starting NFT creation process...");
    const connection = new Connection(clusterApiUrl("devnet"));

    const user = await getKeypairFromFile("D:\\Projects\\node test\\id.json");
    console.log("User loaded from file:", user.publicKey.toBase58());

    await airdropIfRequired(
      connection,
      user.publicKey,
      1 * LAMPORTS_PER_SOL,
      0.1 * LAMPORTS_PER_SOL
    );

    const umi = createUmi(connection);
    const umiKeypair = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
    umi
      .use(keypairIdentity(umiKeypair))
      .use(mplTokenMetadata())
      .use(irysUploader());

    const collectionImagePath = path.resolve(__dirname, "public/favicon.jpg");
    const buffer = await fs.promises.readFile(collectionImagePath);
    const file = createGenericFile(buffer, collectionImagePath, {
      contentType: "image/jpg",
    });

    const [image] = await umi.uploader.upload([file]);
    const uri = await umi.uploader.uploadJson({
      name: `${name} Collection`,
      symbol: name,
      description: `${name} Collection Description`,
      image,
    });

    const collectionMint = generateSigner(umi);
    await createNft(umi, {
      mint: collectionMint,
      name: `${name} Collection`,
      uri,
      sellerFeeBasisPoints: percentAmount(5),
      isCollection: true,
    }).sendAndConfirm(umi);
    console.log("Collection NFT created successfully.");

    const nfts = [];
    for (let i = 0; i < supply; i++) {
      const nftMint = generateSigner(umi);
      const randomColor = getRandomColor();

      const tintedBuffer = await sharp(buffer)
        .tint(`rgb(${randomColor.r},${randomColor.g},${randomColor.b})`)
        .toBuffer();

      const nftFile = createGenericFile(tintedBuffer, collectionImagePath, {
        contentType: "image/jpg",
      });
      const [nftImage] = await umi.uploader.upload([nftFile]);

      const nftUri = await umi.uploader.uploadJson({
        name: `${name} NFT #${i}`,
        symbol: "NFT",
        description: `${name} NFT #${i} description`,
        image: nftImage,
      });

      await createNft(umi, {
        mint: nftMint,
        name: `${name} NFT #${i}`,
        uri: nftUri,
        sellerFeeBasisPoints: percentAmount(5),
        collection: { key: collectionMint.publicKey, verified: false },
      }).sendAndConfirm(umi);

      const metadata = findMetadataPda(umi, {
        mint: nftMint.publicKey,
      });

      await verifyCollectionV1(umi, {
        metadata,
        collectionMint: collectionMint.publicKey,
        authority: umi.identity,
      }).sendAndConfirm(umi);

      console.log(`NFT #${i} verified in collection.`);

      nfts.push({
        name: `${name} NFT #${i}`,
        collectionId: 0,
        address: nftMint.publicKey,
        owner: user.publicKey,
        imageUrl: nftImage,
      });
    }

    const nftCollection = {
      name: `${name} Collection`,
      supply,
      currencyId,
      price,
      address: collectionMint.publicKey,
      associationId,
      associationType,
      imageUrl: image,
    };

    const requestBody = {
      nftCollection,
      nfts,
    };

    await axios.post("https://localhost:7210/api/nfts", requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
      httpsAgent: agent,
    });

    res.status(200).send("NFTs created and verified successfully!");
    console.log("NFT creation and verification completed.");
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).send("Error occurred while creating NFTs.");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
