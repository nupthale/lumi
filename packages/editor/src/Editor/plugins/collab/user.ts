import { UserType } from '../../interface';

import { getProvider } from './core';

import { nameToColor } from '../../shared/color';
import { onlineUsersChange$ } from '../../event';


// 获取所有在线用户
export const getOnlineUsers = (fileId: string) => {
  const provider = getProvider(fileId);
  if (!provider?.awareness) {
    return [];
  }
  
  const states = Array.from(provider.awareness.getStates().values());
  const users = states
    .filter(state => state.user)
    .map(state => state.user);
  
  // 去重，确保同一个用户只出现一次
  const uniqueUsers = users.filter((user, index, self) => 
    index === self.findIndex(u => u.id === user.id)
  );
  
  return uniqueUsers;
};

let userListener: Function | null = null;

// 监听用户状态变化
export const setupUserListener = (fileId: string) => {
  const provider = getProvider(fileId);
  
  userListener = () => {
    const users = getOnlineUsers(fileId);
    console.log('在线用户列表:', users);
  
    onlineUsersChange$.next(users);
  };

  provider?.awareness.on('change', userListener);
};

export const removeUserListener = (fileId: string) => {
  const provider = getProvider(fileId);

  if (userListener) {
    provider?.awareness.off('change', userListener);
  }
};

// 设置协同编辑用户
export const setCollabUser = (fileId: string, user: UserType) => {
  const provider = getProvider(fileId);
  
  if (!provider?.awareness) {
    console.warn('Provider or awareness not available');
    return;
  }

  // 检查当前用户是否已经在 awareness 中设置了状态
  const currentLocalState = provider.awareness.getLocalState();
  const currentUser = currentLocalState?.user;
  
  // 如果当前用户已经设置且是同一个用户，则不需要重复设置
  if (currentUser && currentUser.id === user.id) {
    console.log('User already set in awareness:', currentUser);
    return;
  }

  console.info('Setting user in awareness:', user.name, nameToColor(user.name));

  // 设置用户状态
  provider.awareness.setLocalStateField('user', {
    name: user.name,
    id: user.id,
    color: nameToColor(user.name, 1),
  });
};