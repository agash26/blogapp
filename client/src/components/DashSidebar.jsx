import { Sidebar } from 'flowbite-react';
import { HiArrowSmRight, HiChartBar, HiChat, HiDocumentText, HiUser, HiUserGroup } from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { handleSignout } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function DashSidebar() {
    const location = useLocation();
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const [tab, setTab] = useState('');
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search])
    return (
        <Sidebar className='w-full md:w-56'>
            <Sidebar.Items>
                <Sidebar.ItemGroup className='flex flex-col gap-1'>
                    {currentUser.isAdmin &&
                        <Link to={'/dashboard?tab=dash'}>
                            <Sidebar.Item active={tab === 'dash'} icon={HiChartBar} as='div'>Dashboard</Sidebar.Item>
                        </Link>
                    }
                    <Link to={'/dashboard?tab=profile'}>
                        <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={currentUser.isAdmin ? 'Admin' : "User"} labelColor="dark" as='div'>Profile</Sidebar.Item>
                    </Link>
                    {currentUser.isAdmin &&
                        <Link to={'/dashboard?tab=posts'}>
                            <Sidebar.Item active={tab === 'posts'} icon={HiDocumentText} as='div'>Posts</Sidebar.Item>
                        </Link>
                    }
                    {currentUser.isAdmin &&
                        <>
                            <Link to={'/dashboard?tab=users'}>
                                <Sidebar.Item active={tab === 'users'} icon={HiUserGroup} as='div'>Users</Sidebar.Item>
                            </Link>
                            <Link to={'/dashboard?tab=comments'}>
                                <Sidebar.Item active={tab === 'comments'} icon={HiChat} as='div'>Comments</Sidebar.Item>
                            </Link>
                        </>
                    }
                    <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' onClick={() => dispatch(handleSignout())}>Sign Out</Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    )
}
