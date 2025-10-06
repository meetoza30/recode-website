import pkg from 'youtube-sr';
import fs from 'fs';
import csv from 'csv-parser';
import {createObjectCsvWriter} from 'csv-writer';

// const createCsvWriter  = createObjectCsvWriter();
const {default: YouTube} = pkg;

// Popular Indian programming educators/channels
const INDIAN_PROGRAMMING_CHANNELS = [
    'Striver',
    'CodeHelp - by Babbar', 
    'Love Babbar',
    'Pepcoding',
    'Apna College',
    'CodeWithHarry',
    'Aditya Verma',
    'Abdul Bari',
    'Jenny lectures CS/IT NET&JRF',
    'GeeksforGeeks',
    'Coding Ninjas',
    'GATE Smashers'
];

// Function to create search queries targeting Indian programming content
function createSearchQueries(title, topics) {
    try {
        // Parse topics from CSV format: ["Array","Hash Table"] 
        const topicsClean = topics.replace(/"/g, '').replace(/\[|\]/g, '');
        const topicsList = topicsClean.split(',').map(topic => topic.trim());
        const mainTopic = topicsList[0] || 'programming';
        
        // Create targeted search queries for Indian content
        const queries = [
            `${title} leetcode solution`,
            `${title} leetcode explanation`,
            `${mainTopic} dsa tutorial`,
            `${title} algorithm explanation hindi`
        ];
        
        return queries.slice(0, 2); // Return top 2 queries
    } catch (error) {
        console.error(`Error parsing topics for ${title}:`, error);
        return [`${title} programming solution`, `${title} algorithm explanation`];
    }
}

// Function to search YouTube videos using youtube-sr
async function searchYouTubeVideos(query, limit = 2) {
    try {
        console.log(`Searching for: ${query}`);
        const videos = await YouTube.search(query, { limit: limit });
        
        // Filter for Indian programming channels if possible
        // const filteredVideos = videos.filter(video => {
        //     const channelName = video.channel?.name || '';
        //     return INDIAN_PROGRAMMING_CHANNELS.some(channel => 
        //         channelName.toLowerCase().includes(channel.toLowerCase())
        //     );
        // });
        
        // If no Indian channels found, use original results
        const finalVideos = videos;
        
        // Return only the URLs
        return finalVideos.slice(0, limit).map(video => video.url);
    } catch (error) {
        console.error(`Error searching for ${query}:`, error);
        return [];
    }
}

// Function to get YouTube videos for a problem
async function getYouTubeVideosForProblem(title, topics) {
    const searchQueries = createSearchQueries(title, topics);
    let allVideoUrls = [];
    
    for (const query of searchQueries) {
        try {
            const videoUrls = await searchYouTubeVideos(query, 1);
            allVideoUrls = allVideoUrls.concat(videoUrls);
            
            // Add delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Stop if we have 2 videos
            if (allVideoUrls.length >= 2) {
                break;
            }
        } catch (error) {
            console.error(`Error processing query ${query}:`, error);
        }
    }
    
    // Return top 2 videos
    return allVideoUrls.slice(0, 2);
}

// Function to add delay between requests
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Main function to process CSV file
async function processCSVWithYouTubeVideos(inputFile, outputFile) {
    const results = [];
    
    console.log(`Reading CSV file: ${inputFile}`);
    
    // Read CSV file
    return new Promise((resolve, reject) => {
        fs.createReadStream(inputFile)
            .pipe(csv())
            .on('data', (row) => {
                results.push(row);
            })
            .on('end', async () => {
                console.log(`Found ${results.length} rows to process`);
                
                try {
                    // Process each row to add YouTube videos
                    for (let i = 0; i < results.length; i++) {
                        const row = results[i];
                        
                        console.log(`Processing row ${i + 1}/${results.length}: ${row.title}`);
                        
                        try {
                            // Get YouTube videos for this problem
                            const videoUrls = await getYouTubeVideosForProblem(row.title, row.topics);
                            
                            // Add youtube_videos column as JSON array
                            row.youtube_videos = JSON.stringify(videoUrls);
                            
                            console.log(`  Found ${videoUrls.length} videos for "${row.title}"`);
                            
                            // Add delay between rows to avoid rate limiting
                            await delay(2000);
                            
                        } catch (error) {
                            console.error(`Error processing row ${i}: ${error}`);
                            row.youtube_videos = JSON.stringify([]);
                        }
                    }
                    
                    // Write updated data to new CSV file
                    await writeCSVFile(results, outputFile);
                    console.log(`\nProcessing complete! Updated CSV saved as: ${outputFile}`);
                    
                    // Show sample results
                    showSampleResults(results);
                    
                    resolve(results);
                } catch (error) {
                    reject(error);
                }
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

// Function to write CSV file
async function writeCSVFile(data, outputFile) {
    if (data.length === 0) {
        throw new Error('No data to write');
    }
    
    // Get column headers from the first row
    const headers = Object.keys(data[0]).map(key => ({ id: key, title: key }));
    
    // Create csvWriter with proper configuration - THIS FIXES THE BUG
    const csvWriter = createObjectCsvWriter({
        path: outputFile,
        header: headers
    });
    
    await csvWriter.writeRecords(data);
}

// Function to show sample results
function showSampleResults(results) {
    console.log('\n=== Sample Results ===');
    const sampleCount = Math.min(3, results.length);
    
    for (let i = 0; i < sampleCount; i++) {
        const row = results[i];
        const videos = JSON.parse(row.youtube_videos);
        
        console.log(`\nProblem: ${row.title}`);
        console.log(`Topics: ${row.topics}`);
        console.log(`YouTube Videos (${videos.length}):`);
        
        videos.forEach((url, index) => {
            console.log(`  ${index + 1}. ${url}`);
        });
    }
}

// Execute the main function
async function main() {
    try {
        const inputFile = 'dsa_curated_questions_mahesh.csv';
        const outputFile = 'dsa_curated_questions_mahesh_with_yt.csv';
        
        console.log('Starting YouTube video search process...');
        console.log('This may take a while due to rate limiting delays.\n');
        
        await processCSVWithYouTubeVideos(inputFile, outputFile);
        
    } catch (error) {
        console.error('Error processing CSV:', error);
    }
}

// Run the script
main();
