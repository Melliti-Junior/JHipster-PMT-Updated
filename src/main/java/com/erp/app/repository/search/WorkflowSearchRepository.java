package com.erp.app.repository.search;

import com.erp.app.domain.Workflow;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Workflow entity.
 */
public interface WorkflowSearchRepository extends ElasticsearchRepository<Workflow, String> {
}
