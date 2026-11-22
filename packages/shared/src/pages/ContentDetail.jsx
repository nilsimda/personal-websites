import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@monorepo/shared/utils';
import { Embed, DynamicNavigation } from '@monorepo/shared/components';
import { fetchSiteContent } from '../utils/siteContent.js';

const SITE_ID = import.meta.env.VITE_SUPABASE_USER_ID;

function ContentDetail({ logoUrl, siteId = SITE_ID }) {
    const { id } = useParams();
    const navigate = useNavigate();
    // status: 'loading' | 'found' | 'missing' | 'error'
    const [state, setState] = useState({ status: 'loading', content: null });

    useEffect(() => {
        let active = true;
        setState({ status: 'loading', content: null });

        fetchSiteContent(supabase, { id, siteId })
            .then((content) => {
                if (!active) return;
                setState(content
                    ? { status: 'found', content }
                    : { status: 'missing', content: null });
            })
            .catch((error) => {
                console.error('Error fetching content:', error);
                if (active) setState({ status: 'error', content: null });
            });

        return () => {
            active = false;
        };
    }, [id, siteId]);

    if (state.status === 'loading') {
        return <div className="text-center py-16">Lädt...</div>;
    }

    if (state.status !== 'found') {
        return (
            <>
                <DynamicNavigation isHomePage={false} logoUrl={logoUrl} />
                <div className="max-w-4xl mx-auto py-16 px-4 text-center">
                    <h1 className="text-2xl font-bold mb-4">
                        {state.status === 'missing'
                            ? 'Beitrag nicht gefunden'
                            : 'Beitrag konnte nicht geladen werden'}
                    </h1>
                    <Link to="/" className="text-gray-600 hover:text-gray-900">
                        Zur Startseite
                    </Link>
                </div>
            </>
        );
    }

    const { content } = state;
    return (
        <>
            <DynamicNavigation isHomePage={false} logoUrl={logoUrl} />
            <article className="max-w-4xl mx-auto py-16 px-4">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-8 text-gray-600 hover:text-gray-900"
                >
                    ← Zurück
                </button>

                <h1 className="text-4xl font-bold mb-8">{content.title}</h1>

                <Embed content={content} />

                <div className="prose max-w-none mt-8">
                    <p className="whitespace-pre-wrap text-gray-700">{content.text}</p>
                </div>

                <div className="mt-8 text-gray-500">
                    {new Date(content.date).toLocaleDateString()}
                </div>
            </article>
        </>
    );
}

export default ContentDetail;
