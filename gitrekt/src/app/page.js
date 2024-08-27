"use client"
import { useEffect, useState } from 'react';
import SideBar from '@/components/SideBar';
import TopBar from '@/components/TopBar';
import CommitSection from '@/components/CommitSection';
import StorageService from '@/components/services/StorageService';
import LocalContent from '@/components/LocalContent';
import EventBus from '@/components/services/EventBus';
import ApiTokenPrompt from '@/components/ApiTokenPrompt';


export default function Home() {
  const [repoName, setRepoName] = useState(null);
  const [repoDir, setRepoDir] = useState(null);
  const [href, setHref] = useState(null);
  const [ownerName, setOwnerName] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storageService = new StorageService();

    async function fetchStorageData() {
      try {
        const name = await storageService.getItem('repoName');
        const dir = await storageService.getItem('repoDir');
        const url = await storageService.getItem('githubURL');
        const owner = await storageService.getItem('owner')

        setRepoName(name);
        setRepoDir(dir);
        setHref(url);
        setOwnerName(owner);

        setReady(name != null && dir != null && url != null && owner != null && process.env.NEXT_PUBLIC_TOKEN != null);

      } catch (error) {
        console.error('Failed to fetch data from storage:', error);
      }
    }

    function handleStorageChange(event) {
      fetchStorageData();
    }

    EventBus.on('storageChanged', handleStorageChange);

    fetchStorageData();
  }, []);



  return (
    <div className='w-full h-screen overflow-hidden'>
      {!process.env.NEXT_PUBLIC_TOKEN ? (<ApiTokenPrompt />) : null}
      {ready ? (
        <>
          <div className='h-1/12'>
            <TopBar reponame={repoName} />
          </div>
          <div className='flex justify-between h-full'>
            <SideBar owner={ownerName} repoName={repoName} />
            <CommitSection repoPath={repoDir}/>
          </div>
        </>
      ) : (
        <div className='flex flex-col w-full h-screen text-lg text-center justify-center items-center'>
          <img src='icons/empty.png' className='w-40' />
          <LocalContent />
        </div>)}
    </div>
  );
}