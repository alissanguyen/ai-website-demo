/* eslint-disable @next/next/no-img-element */
'use client'

import { CompleteConverse, Model } from '@/types';
import * as React from 'react';
import { sortConversationByTimestamp } from '../utils';

interface Props { }

const models: Model[] = [
    {
        id: "image",
        name: "Image Generation"
    },
    {
        id: "imageUpgraded",
        name: "Image Generation Pro"
    },
    {
        id: "textGeneration",
        name: "Text Generation"
    },
    {
        id: "textGenerationUpgraded",
        name: "Text Generation Pro"
    },
    {
        id: "imageClassification",
        name: "Image Classification"
    }
]

const AiPage: React.FC<Props> = ({ }) => {
    const [conversation, setConversation] = React.useState<CompleteConverse[]>([]);
    const [model, setModel] = React.useState<Model>(models[0])

    const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
    const [imagePreview, setImagePreview] = React.useState<string | null>(null);
    const [classificationResult, setClassificationResult] = React.useState<string | null>(null);


    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (model.id === models[4].id && selectedImage) {
            const arrayBuffer = await selectedImage.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);

            const response = await fetch('http://localhost:8787', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ model: 'imageClassification', image: Array.from(uint8Array) }),
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

            fetch('http://localhost:8787', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ prompt: formData.get('prompt'), model: model.id }),
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

    return (
        <main className="flex min-h-[10rem] flex-col items-center justify-between p-24 text-white">
            <form method="POST" onSubmit={onSubmit} className="flex flex-col gap-5 min-w-[30rem]">
                <label htmlFor="model">Choose a model:</label>
                <select id="model"
                    name="model"
                    className="text-black"
                    value={model.id}
                    onChange={(e) => {
                        const selectedModel = models.find((m) => m.id === e.target.value);
                        if (selectedModel) {
                            setModel(selectedModel);
                        }
                    }}>
                    {models.map((model) => (
                        <option key={model.id} value={model.id}>{model.name}</option>
                    ))}
                </select>
                {/* We are not using the image classifier model */}
                {model.id !== models[4].id ? (
                    <input name="prompt" placeholder='enter prompt' className="custom-border" />
                ) : (
                    // We are using the image classifier model, so we add an input form for user to submit an image
                    <input type="file" accept="image/*" onChange={handleImageChange} />

                )}
                <button type="submit" className="p-5 rounded-xl bg-gray-600 border-2 border-yellow-400/[0] hover:bg-gray-900 hover:border-2 hover:border-yellow-400/[1]">Submit</button>
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
                    <React.Fragment key={index}>
                        <p className="text-lg mb-2">Prompt: {item.prompt}</p>
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
                    </React.Fragment>
                ))}
            </div>

        </main>
    )
}

export default AiPage