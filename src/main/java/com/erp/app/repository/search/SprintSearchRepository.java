package com.erp.app.repository.search;

import com.erp.app.domain.Sprint;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Sprint entity.
 */
public interface SprintSearchRepository extends ElasticsearchRepository<Sprint, String> {
}
