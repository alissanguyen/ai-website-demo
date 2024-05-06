/* eslint-disable @next/next/no-img-element */
'use client';
import { CompleteConverse, Model, UserProfile } from '@/types/types';
import * as React from 'react';
import { sanitizeInput, sortConversationByTimestamp } from '../../utils/utils';
import SelectMenu from '@/components/SelectMenu/SelectMenu';
import { models } from '../../constants';
import { Spinner } from '@chakra-ui/react';
import { supabaseClient } from '@/utils/supabase/client';
import { UserContext } from '@/contexts/UserContext';
import { User } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import useAuth from '@/hooks/useAuth';

interface Props {
    user: User | null;
}

const AiForm: React.FC<Props> = ({ user }) => {
    const { avatarUrl, userId } = React.useContext(UserContext)
    const [conversation, setConversation] = React.useState<CompleteConverse[]>([]);
    const [model, setModel] = React.useState<Model>(models[0]);
    const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
    const [imagePreview, setImagePreview] = React.useState<string | null>(null);
    const [classificationResult, setClassificationResult] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [userProfile, setUserProfile] = React.useState<UserProfile | null>();

    React.useEffect(() => {
        const fetchUserProfile = async () => {
            if (userId) {

                const { data, error } = await supabaseClient
                    .from('profiles')
                    .select('*')
                    .eq('id', userId)
                    .single();

                if (error) {
                    console.error('Error fetching user profile:', error);
                } else {
                    setUserProfile(data)
                    setConversation((prevConversation) => [...(data.conversations || []), ...prevConversation]);
                }
            }
        };

        fetchUserProfile();

    }, [userId]);

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        if (model.id === models[4].id && selectedImage) {
            const arrayBuffer = await selectedImage.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);

            const response = await fetch('https://cloudflare-ai-demo.im-tamnguyen.workers.dev', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ model: 'imageClassification', image: Array.from(uint8Array) }),
            })

            const result = await response.json();
            const classificationResultText = `Classification: ${result[0].label}`;
            setClassificationResult(classificationResultText);

            // Save the image URL and classification result to the conversation
            if (classificationResultText && imagePreview) {
                setConversation((prevConversation) => [
                    ...prevConversation,
                    {
                        prompt: 'Classify this image',
                        response: {
                            type: 'imageClassification',
                            content: classificationResultText,
                            imageUrl: imagePreview,
                        },
                        timestamp: Date.now(),
                    },
                ]);
            }

            // Clear the image preview and reset the states
            setSelectedImage(null);
            setImagePreview(null);
            setClassificationResult(null);
            setIsLoading(false)

        } else {
            const formData = new FormData(event.currentTarget)
            const prompt = formData.get('prompt') as string;

            // Validate and sanitize the prompt
            const sanitizedPrompt = sanitizeInput(prompt);

            try {
                const response = await fetch('https://cloudflare-ai-demo.im-tamnguyen.workers.dev', {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({ prompt: sanitizedPrompt, model: model.id }),
                });

                const data = await (model.id === models[0].id || model.id === models[1].id
                    ? response.blob()
                    : response.json());

                const newConversationEntry: CompleteConverse = model.id === models[0].id || model.id === models[1].id
                    ? { prompt, response: { type: 'image', content: URL.createObjectURL(data) }, timestamp: Date.now() }
                    : { prompt, response: { type: 'text', content: data.data.response }, timestamp: Date.now() };

                setConversation((prevConversation) => [...prevConversation, newConversationEntry]);

                // Save the conversation to the user's profile
                if (userId) {
                    const { data: profileData, error: profileError } = await supabaseClient
                        .from('profiles')
                        .select('conversations')
                        .eq('id', userId)
                        .single();

                    if (profileError) {
                        console.error('Error fetching user profile:', profileError);
                    } else {
                        // Handle when profileData.conversations is null, causing 
                        // the updatedConversations array to include null as the 
                        // first element. 
                        /**
                         * 1. Checks if profileData.conversations exists. 
                         * 2. If it does, it spreads the existing conversations 
                         *      and appends the newConversationEntry. 
                         * 3. If it doesn't exist, it creates a new array with 
                         *      only the newConversationEntry.
                         */
                        const updatedConversations = profileData.conversations
                            ? [...profileData.conversations, newConversationEntry]
                            : [newConversationEntry];
                        const { error: updateError } = await supabaseClient
                            .from('profiles')
                            .update({ conversations: updatedConversations })
                            .eq('id', userId)

                        if (updateError) {
                            console.error('Error updating conversations:', updateError);
                        }
                    }
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        }
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const sortedConversation = sortConversationByTimestamp(conversation);

    return (
        <main className="flex min-h-[10rem] flex-col items-center justify-between p-10 pt-24 md:p-24 text-white">
            <form method="POST" onSubmit={onSubmit} className="flex flex-col gap-5 w-full md:max-w-[50%]">
                <SelectMenu
                    models={models}
                    selectedModel={model}
                    onModelChange={(selectedModel) => setModel(selectedModel)}
                />
                {/* We are not using the image classifier model */}
                {model.id !== models[4].id ? (
                    <input name="prompt" placeholder='enter prompt' className="custom-border" required
                        pattern=".+"
                        title="Please enter a prompt" />
                ) : (
                    // We are using the image classifier model, so we add an input form for user to submit an image
                    <input type="file" accept="image/*" onChange={handleImageChange} />

                )}
                <button type="submit" className="Submit__Button p-5 rounded-xl border-2 border-yellow-400/[0] hover:border-2 hover:border-yellow-400/[1] ease-in-out duration-200">Submit</button>
            </form>

            <div className="response-wrapper pt-12 lg:p-20">

                {model.id === models[4].id ? (
                    // We are using the image classifier model, so we add an input form for user to submit an image
                    <div>
                        {imagePreview && (
                            <div className="flex flex-col items-start gap-3">
                                <p>Image Preview:</p>
                                <img src={imagePreview} alt="Image Preview" className="image-preview" />
                            </div>

                        )}
                    </div>
                ) : null}

                {sortedConversation.map((item, index) => (
                    <div key={index} className="mb-10">
                        <div className="Prompt__Bubble Bubble mb-2 mr-10 flex flex-row items-center gap-3" style={{ opacity: "1", transform: "none" }}>
                            {avatarUrl ? (<img src={avatarUrl} alt="avatar" className='w-10 h-10 rounded-full object-cover' />) : <p>Prompt:</p>}
                            <p>{item.prompt}</p>
                        </div>
                        <div className="Response__Bubble Bubble">
                            {item.response.type === 'image' ? (
                                <img src={item.response.content} alt="" className="Image_Element mb-4" />
                            ) : item.response.type === 'imageClassification' ? (
                                <>
                                    <img src={item.response.imageUrl} alt="" className="Image_Element mb-4" />
                                    <p className="text-lg mb-4">Answer: {item.response.content}</p>
                                </>
                            ) : (
                                <p className="text-lg mb-4">Answer: {item.response.content}</p>
                            )}
                        </div>
                    </div>
                ))}
                {isLoading ? <Spinner /> : null}
            </div>

        </main>
    )
}

export default AiForm