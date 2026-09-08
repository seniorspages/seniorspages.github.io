export interface Album {
  id: string;
  name: string;
  description?: string;
  coverPhotoId?: string;
  createdAt: string;
}

export interface Photo {
  id: string;
  url: string;
  storagePath: string;
  caption: string;
  uploadedBy?: string;
  createdAt: string;
  albumId?: string;
  likeCount: number;
}
