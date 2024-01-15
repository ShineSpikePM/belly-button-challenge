let data = d3.json("samples.json");
console.log(data);



// function that populates the meta data
function demoInfo(sample)
{
    console.log(sample);
    // use d3.json in order to get the data
    d3.json("samples.json").then((data) => {
        // grab all of the meta data
        let metadata = data.metadata;
        //console.log(metadata);

        // filter based on the value of the sample ID
        // this should return 1 result of the array based on the dataset
        let result = metadata.filter(sampleResult => sampleResult.id == sample);

        // access index 0 from the array
        let resultData = result[0];

        // clear the metadata out
        d3.select("#sample-metadata").html(""); // clears the html out

        // use object.entries to get the value key pairs
        Object.entries(resultData).forEach(([key, value]) =>{
            // add to the sample data / demographic section
            d3.select("#sample-metadata")
                .append("h5").text(`${key}: ${value}`);
        })
    });
}
// function that builds the bar chart

function buildBarChart(sample)
{
    d3.json("samples.json").then((data) => {
        // grab all of the sample data
        let sampleData = data.samples;

        // filter based on the value of the sample ID
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);

        // access index 0 from the array
        let resultData = result[0];

        // get the otu_ids
        let otu_ids = resultData.otu_ids;
        // get the otu labels
        let otu_labels = resultData.otu_labels;
        // get the sample values
        let sample_values = resultData.sample_values;

        // build the bar chart
        // get the yticks
        // use slice because we only want the top 10 
        let yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`);
        let xValues = sample_values.slice(0,10);
        let textLabels = otu_labels.slice(0, 10);

        let barChart = {
            y: yticks.reverse(),
            x: xValues.reverse(),
            text: textLabels.reverse(),
            type: "bar",
            orientation: "h"
        }

        let layout = {
            title: "Top 10 Belly Button Bacteria"
        };

        Plotly.newPlot("bar", [barChart], layout);
    });
}

// function that builds the bubble chart
function buildBubbleChart(sample)
{
    d3.json("samples.json").then((data) => {
        // grab all of the sample data
        let sampleData = data.samples;

        // filter based on the value of the sample ID
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);

        // access index 0 from the array
        let resultData = result[0];

        // get the otu_ids
        let otu_ids = resultData.otu_ids;
        // get the otu labels
        let otu_labels = resultData.otu_labels;
        // get the sample values
        let sample_values = resultData.sample_values;

        // build bubble chart


        let bubbleChart = {
            y: sample_values,
            x: otu_ids,
            text: sample_values,
            mode: "markers",
            marker:{
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
            
        }

        let layout = {
            title: "Bacteria Cultures Per Sample",
            hovermode:"closest",
            xaxis: {title: "OTU ID"}
        };

        Plotly.newPlot("bubble", [bubbleChart], layout);
    });
}


// function that initializes the dashboard
function initialize()
{

    //let data = d3.json("samples.json");
    //console.log(data);
    
    // access the dropdown selector from the index.html file
    var select = d3.select("#selDataset");

    // load the data from the .json file
    // use d3.json in order to get the data
    d3.json("samples.json").then((data) => {
        let sampleNames = data.names; // made an array of just the names
        console.log(sampleNames);

        // use a foreach for the selector to create options of each sample
        sampleNames.forEach((sample) => {
            select.append("option")
                .text(sample)
                .property("value", sample);
        });
        // when initialized, pass in the information for the first sample
        let sample1 = sampleNames[0];

        // call the function to build the metadata
        demoInfo(sample1);
        // call function to build the bar chart
        buildBarChart(sample1);
        // call function to build the bubble chart
        buildBubbleChart(sample1);
    });
}
// function that updates the dashboard
function optionChanged(item)
{
    // prints the item for now
    //console.log(item)

    // now call the update for the metadata
    demoInfo(item);
    // call function to build the bar chart 
    buildBarChart(item);
    // call function to build the bubble chart
    buildBubbleChart(item);
}

// call to initialize function
initialize();