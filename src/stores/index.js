// src/stores/index.js
import { useUserStore } from './modules/users'
import { usePostStore } from './modules/posts'
import { useMessageStore } from './modules/messages'
import {useCommentStore} from "./modules/comments";

export { useUserStore, usePostStore, useMessageStore,useCommentStore }
