/* eslint-disable @next/next/no-img-element */
'use client'

import { CompleteConverse, Model } from '@/types';
import * as React from 'react';
import { getConversationFromLocalStorage, sanitizeInput, sortConversationByTimestamp } from '../utils';
import SelectMenu from '@/components/SelectMenu/SelectMenu';
import { models } from '../constants';

interface Props { }



const AiPage: React.FC<Props> = ({ }) => {
    const [conversation, setConversation] = React.useState<CompleteConverse[]>(getConversationFromLocalStorage());
    const [model, setModel] = React.useState<Model>(models[0])

    const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
    const [imagePreview, setImagePreview] = React.useState<string | null>(null);
    const [classificationResult, setClassificationResult] = React.useState<string | null>(null);

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsLoading(true);

        if (model.id === models[4].id && selectedImage) {
            const arrayBuffer = await selectedImage.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);

            const response = await fetch('http://localhost:8787', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ model: 'imageClassification', image: Array.from(uint8Array) }),
            }).finally(() => {
                setIsLoading(false);
            });

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


        } else {
            const formData = new FormData(event.currentTarget)
            const prompt = formData.get('prompt') as string;
            /**
             * {
             *   "prompt": ...,
             *   "model" : ...
             * }
             */

            // Validate and sanitize the prompt
            const sanitizedPrompt = sanitizeInput(prompt);

            fetch('https://cloudflare-ai-demo.im-tamnguyen.workers.dev', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ prompt: sanitizedPrompt, model: model.id }),
            })
                .then((res) => {
                    if (model.id === models[0].id || model.id === models[1].id) {
                        // Handle image response
                        return res.blob();
                    } else if (model.id === models[2].id || model.id === models[3].id) {
                        // Handle text response
                        return res.json();
                    } else {
                        throw new Error('Unsupported model');
                    }
                })
                .then((data) => {
                    if (model.id === models[0].id || model.id === models[1].id) {
                        // Process image response
                        const imageUrl = URL.createObjectURL(data);
                        setConversation((prevConversation) => [
                            ...prevConversation,
                            { prompt, response: { type: 'image', content: imageUrl }, timestamp: Date.now() },
                        ]);
                    } else if (model.id === models[2].id || model.id === models[3].id) {
                        // Process text response
                        setConversation((prevConversation) => [
                            ...prevConversation,
                            { prompt, response: { type: 'text', content: data.data.response }, timestamp: Date.now() },
                        ]);
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                }).finally(() => {
                    setIsLoading(false);
                });
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

    // Save the updated conversation state to local storage if available
    if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('conversation', JSON.stringify(conversation));
    }

    return (
        <main className="flex min-h-[10rem] flex-col items-center justify-between p-24 text-white">
            <form method="POST" onSubmit={onSubmit} className="flex flex-col gap-5 min-w-[30rem]">
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
                <button type="submit" className="Submit__Button p-5 rounded-xl border-2 border-yellow-400/[0] hover:border-2 hover:border-yellow-400/[1]">Submit</button>
            </form>

            <div className="response-wrapper p-20">

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
                        <p className="Prompt__Bubble Bubble mb-2 mr-10" style={{ opacity: "1", transform: "none" }}>Prompt: {item.prompt}</p>
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
                {isLoading ? <p>Loading..</p> : null}
            </div>

        </main>
    )
}

export default AiPage