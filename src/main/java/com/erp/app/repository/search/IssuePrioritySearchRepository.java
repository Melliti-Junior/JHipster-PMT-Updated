package com.erp.app.repository.search;

import com.erp.app.domain.IssuePriority;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the IssuePriority entity.
 */
public interface IssuePrioritySearchRepository extends ElasticsearchRepository<IssuePriority, String> {
}
