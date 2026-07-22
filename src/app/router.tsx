import { createBrowserRouter } from 'react-router-dom';
import { App } from '@/app/App';
import { HomePage } from '@/pages/HomePage';
import { SettingsPage } from '@/pages/SettingsPage';
import { TopicPage } from '@/pages/TopicPage';
import { TopicsPage } from '@/pages/TopicsPage';
import ReviewPage from '../pages/ReviewPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'settings',
        element: <SettingsPage />
      },
      {
        path: 'topics',
        element: <TopicsPage />
      },
      {
        path: 'topics/:topicId',
        element: <TopicPage />
      },
      {
        path: 'review',
        element: <ReviewPage />
      }
    ]
  }
]);
