import { createBrowserRouter } from 'react-router-dom';
import { App } from '@/app/App';
import { HomePage } from '@/pages/HomePage';
import { SettingsPage } from '@/pages/SettingsPage';
import { TopicPage } from '@/pages/TopicPage';
import { TopicsPage } from '@/pages/TopicsPage';
import ReviewPage from '@/pages/ReviewPage';
import { ReviewTopicsPage } from '@/pages/ReviewTopicsPage';
import { VerbsPage } from '@/pages/VerbsPage';
import { VerbPage } from '@/pages/VerbPage';
import { VerbRulesPage } from '@/pages/VerbRulesPage';

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
        path: 'verbs',
        element: <VerbsPage />
      },
      {
        path: 'verbs/rules',
        element: <VerbRulesPage />
      },
      {
        path: 'verbs/:verbId',
        element: <VerbPage />
      },
      {
        path: 'review',
        element: <ReviewTopicsPage />
      },
      {
        path: 'review/:topicId',
        element: <ReviewPage />
      }
    ]
  }
]);
