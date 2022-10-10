const api = `https://hacker-news.firebaseio.com/v0`
const json = '.json?print=pretty'


export interface User {
  id: string;
  submitted: string[];
  created: number;
  karma: number;
  about: string;
}

export type PostType = "story" | "comment";
export type FetchType = "top" | "new";

export interface IPost {
  id: string;
  type: PostType;
  
  by: string; 
  time: number;
  descendants: number;
  
  text: string;
  
  kids: string[];
  deleted: boolean; 
  dead: boolean;
  url: string;
  title: string;
}


function removeDead (posts: IPost[]): IPost[] {
  return posts.filter(Boolean).filter(({ dead }) => dead !== true)
}

function removeDeleted (posts: IPost[]): IPost[] {
  return posts.filter(({ deleted }) => deleted !== true)
}

function onlyComments (posts: IPost[]): IPost[] {
  return posts.filter(({ type }) => type === 'comment')
}

function onlyPosts (posts: IPost[]): IPost[] {
  return posts.filter(({ type }) => type === 'story')
}

export function fetchItem (id: string): Promise<IPost> {
  return fetch(`${api}/item/${id}${json}`)
    .then((res) => res.json())
}

export function fetchComments (ids: string[]): Promise<IPost[]> {
  return Promise.all(ids.map(fetchItem))
    .then((comments) => removeDeleted(onlyComments(removeDead(comments))))
}

export function fetchMainPosts (type: FetchType): Promise<IPost[]> {
  return fetch(`${api}/${type}stories${json}`)
    .then((res) => res.json())
    .then((ids) => {
      if (!ids) {
        throw new Error(`There was an error fetching the ${type} posts.`)
      }

      return ids.slice(0, 50)
    })
    .then((ids) => Promise.all(ids.map(fetchItem)))
    .then((posts) => removeDeleted(onlyPosts(removeDead(posts))))
}

export function fetchUser (id:string): Promise<User> {
  return fetch(`${api}/user/${id}${json}`)
  .then((res) => res.json())
}

export function fetchPosts (ids: string[]): Promise<IPost[]> {
  return Promise.all(ids.map(fetchItem))
    .then((posts) => removeDeleted(onlyPosts(removeDead(posts))))
}