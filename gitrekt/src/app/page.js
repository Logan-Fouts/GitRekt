import SideBar from '@/components/SideBar'
import TopBar from '@/components/TopBar';
import CommitSection from '@/components/CommitSection';

export default function Home() {
  return (
    <div className='w-full'>
      <TopBar reponame='PicPurge' />
      <div className='flex justify-between'>
        <SideBar href='https://github.com/Logan-Fouts/PicPurge' reponame='PicPurge' owner='Logan-Fouts' repodir='~/Code/PicPurge' />
        <CommitSection />
      </div>
    </div>
  );
}
