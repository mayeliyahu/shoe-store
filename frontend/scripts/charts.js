function createBarChart(container, data, title) {
    const chartWidth = document.querySelector(container).offsetWidth;
    const chartHeight = 300;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const svg = d3.select(container)
        .append("svg")
        .attr("width", chartWidth)
        .attr("height", chartHeight);

    const xScale = d3.scaleBand()
        .domain(data.map(d => `${d._id.year}-${d._id.month}`))
        .range([margin.left, chartWidth - margin.right])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)])
        .nice()
        .range([chartHeight - margin.bottom, margin.top]);

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(`${d._id.year}-${d._id.month}`))
        .attr("y", d => yScale(d.count))
        .attr("width", xScale.bandwidth())
        .attr("height", d => chartHeight - margin.bottom - yScale(d.count))
        .attr("fill", "steelblue");

    svg.append("g")
        .attr("transform", `translate(0,${chartHeight - margin.bottom})`)
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale));
}

function createLinearChart(container, data, title) {
    const chartWidth = document.querySelector(container).offsetWidth;
    const chartHeight = 300;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const svg = d3.select(container)
        .append("svg")
        .attr("width", chartWidth)
        .attr("height", chartHeight);

    const xScale = d3.scalePoint()
        .domain(data.map(d => `${d._id.year}-${d._id.month}`))
        .range([margin.left, chartWidth - margin.right]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.cumulativeOrders)])
        .nice()
        .range([chartHeight - margin.bottom, margin.top]);

    const line = d3.line()
        .x(d => xScale(`${d._id.year}-${d._id.month}`))
        .y(d => yScale(d.cumulativeOrders));

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);

    svg.append("g")
        .attr("transform", `translate(0,${chartHeight - margin.bottom})`)
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale));
}
