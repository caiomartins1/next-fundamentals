import path from 'path';
import { readdirSync, readFileSync } from 'fs';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

export function getSortedPostsData() {
  const postsDirectory = path.join(process.cwd(), 'src', 'posts');
  const fileNames = readdirSync(postsDirectory);
  const allPostsData = getPostsData(fileNames, postsDirectory);

  return sortPosts(allPostsData);
}

const getPostsData = (fileNames, postsDirectory) => {
  return fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = readFileSync(fullPath, 'utf-8');
    const matterResult = matter(fileContents);

    return {
      id,
      ...matterResult.data,
    };
  });
};

const sortPosts = (posts) => {
  return posts.sort(({ date: a }, { date: b }) => {
    if (a < b) return 1;
    else if (a > b) return -1;
    else return 0;
  });
};

export function getAllPostsIds() {
  const postsDirectory = path.join(process.cwd(), 'src', 'posts');
  const fileNames = readdirSync(postsDirectory);

  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

export async function getPostData(id) {
  const postsDirectory = path.join(process.cwd(), 'src', 'posts');
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}
