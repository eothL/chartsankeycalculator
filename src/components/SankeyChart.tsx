import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import { SankeyData, SankeyNode, SankeyLink } from '../types';

interface SankeyChartProps {
  data: SankeyData;
  theme: 'dark' | 'light';
  width: number;
  height: number;
}

export const SankeyChart: React.FC<SankeyChartProps> = ({ data, theme, width, height }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.nodes.length === 0) return;

    // Nettoyer le SVG
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Créer le layout Sankey
    const sankeyLayout = sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[1, 1], [chartWidth - 1, chartHeight - 1]]);

    // Préparer les données pour D3
    const graph = {
      nodes: data.nodes.map(d => ({ ...d })),
      links: data.links.map(d => ({ ...d }))
    };

    // Appliquer le layout
    const { nodes, links } = sankeyLayout(graph);

    // Couleurs
    const colors = theme === 'dark' 
      ? d3.scaleOrdinal(d3.schemeCategory10)
      : d3.scaleOrdinal(d3.schemeSet1);

    // Créer les liens
    const link = svg.append('g')
      .selectAll('.link')
      .data(links)
      .enter().append('path')
      .attr('class', 'link')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', (d: any) => d.color || colors(d.source.id))
      .attr('stroke-width', (d: any) => Math.max(1, d.width))
      .attr('fill', 'none')
      .attr('opacity', 0.7)
      .on('mouseover', function(event, d: any) {
        d3.select(this).attr('opacity', 1);
        
        // Tooltip
        const tooltip = d3.select('body').append('div')
          .attr('class', 'tooltip')
          .style('position', 'absolute')
          .style('background', theme === 'dark' ? '#333' : '#fff')
          .style('color', theme === 'dark' ? '#fff' : '#333')
          .style('padding', '8px')
          .style('border-radius', '4px')
          .style('font-size', '12px')
          .style('pointer-events', 'none')
          .style('box-shadow', '0 2px 8px rgba(0,0,0,0.2)')
          .style('z-index', '1000');
        
        const totalValue = links.reduce((sum, l: any) => sum + l.value, 0);
        const percentage = ((d.value / totalValue) * 100).toFixed(1);
        
        tooltip.html(`
          <strong>${d.source.name} → ${d.target.name}</strong><br/>
          Montant: ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(d.value)}<br/>
          Pourcentage: ${percentage}%
        `);
      })
      .on('mousemove', function(event) {
        const tooltip = d3.select('.tooltip');
        tooltip
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 0.7);
        d3.select('.tooltip').remove();
      });

    // Créer les nœuds
    const node = svg.append('g')
      .selectAll('.node')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'node')
      .attr('transform', (d: any) => `translate(${d.x0},${d.y0})`);

    // Rectangles des nœuds
    node.append('rect')
      .attr('height', (d: any) => d.y1 - d.y0)
      .attr('width', (d: any) => d.x1 - d.x0)
      .attr('fill', (d: any) => d.color || colors(d.id))
      .attr('stroke', theme === 'dark' ? '#666' : '#ccc');

    // Labels des nœuds
    node.append('text')
      .attr('x', (d: any) => d.x0 < chartWidth / 2 ? 6 : -6)
      .attr('y', (d: any) => (d.y1 - d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', (d: any) => d.x0 < chartWidth / 2 ? 'start' : 'end')
      .attr('fill', theme === 'dark' ? '#fff' : '#333')
      .attr('font-size', '12px')
      .text((d: any) => d.name)
      .on('mouseover', function(event, d: any) {
        // Tooltip pour les nœuds
        const tooltip = d3.select('body').append('div')
          .attr('class', 'tooltip')
          .style('position', 'absolute')
          .style('background', theme === 'dark' ? '#333' : '#fff')
          .style('color', theme === 'dark' ? '#fff' : '#333')
          .style('padding', '8px')
          .style('border-radius', '4px')
          .style('font-size', '12px')
          .style('pointer-events', 'none')
          .style('box-shadow', '0 2px 8px rgba(0,0,0,0.2)')
          .style('z-index', '1000');
        
        const totalValue = nodes.reduce((sum, n: any) => sum + (n.value || 0), 0);
        const percentage = totalValue > 0 ? ((d.value / totalValue) * 100).toFixed(1) : '0';
        
        tooltip.html(`
          <strong>${d.name}</strong><br/>
          Valeur: ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(d.value || 0)}<br/>
          Pourcentage: ${percentage}%
        `);
      })
      .on('mousemove', function(event) {
        const tooltip = d3.select('.tooltip');
        tooltip
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select('.tooltip').remove();
      });

  }, [data, theme, width, height]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={{
        backgroundColor: 'transparent',
        fontFamily: 'Arial, sans-serif'
      }}
    />
  );
};
