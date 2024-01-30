import { useQuery } from '@tanstack/react-query';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import EventItem from './EventItem.jsx';
import { fetchEvents } from '../../util/http.js';

export default function NewEventsSection() {
    const { data, isPending, isError, error } = useQuery({
        queryKey: ['events', { max: 3 }],
        queryFn: ({ signal, queryKey }) => fetchEvents({ signal, ...queryKey[1] }),
        staleTime: 5000, // 컴포넌트를 렌더링하고 다시 렌더링을 요청했을 때 5초안에 이 일이 일어나면 요청 하지 않음.// 쓸데없는 요청을 제한
        //   gcTime: 30000, // 캐시 데이터가 30초 이후에 없어짐.다시 재 요청을 해야함.
    });

    let content;

    if (isPending) {
        content = <LoadingIndicator />;
    }

    if (isError) {
        content = <ErrorBlock title="An error occurred" message={error.info?.message || 'Failed to fetch events.'} />;
    }

    if (data) {
        content = (
            <ul className="events-list">
                {data.map((event) => (
                    <li key={event.id}>
                        <EventItem event={event} />
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <section className="content-section" id="new-events-section">
            <header>
                <h2>Recently added events</h2>
            </header>
            {content}
        </section>
    );
}
