import SideBar from '@/components/SideBar'
import TopBar from '@/components/TopBar';
import CommitSection from '@/components/CommitSection';

export default function Home() {
  return (
    <div className='w-full'>
      <TopBar reponame='PicPurge' />
      <div className='flex justify-between'>
        <SideBar href='https://github.com/Logan-Fouts/GitRekt' reponame='GitRekt' owner='Logan-Fouts' repodir='~/Code/Thesis' />
        <CommitSection />
      </div>
    </div>
  );
}
